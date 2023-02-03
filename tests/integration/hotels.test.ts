import supertest from "supertest";
import app, { init } from "@/app";
import { prisma } from "@/config";
import httpStatus from "http-status";
import { date } from "joi";

beforeAll(async () => {
    await init();
    await prisma.address.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.ticket.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.ticketType.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.hotel.deleteMany({});
  });


let token = '';
let enrollmentId = 0;
let hotelTicketType;
let remoteTicketType;
let ticketId = 0;

const server = supertest(app);

describe("GET /hotels", () => {


    it ('Should respond with status 401 if no token is given', async () => {

        const response = await server.get('/hotels');

        expect(response.status).toBe(401)
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = 'lalalala123tokenhahaha'
    
        const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

    it("should respond with status 404 if user doesn't have enrollment", async () => {
        const user =  await server.post('/users').send({
            email: "teste@teste.com",
            password: "senha123"
        })
    
        const login = await server.post('/auth/sign-in').send({
            email: "teste@teste.com",
            password: "senha123"
        })

        token = (login.body.token);

        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.text).toBe("We couldn't find user enrollment");
    });

    it ("should respond with status 404 if user have enrollment but no ticket", async () => {


        const body = {
            name: 'lalal123',
            cpf: '12960972775',
            birthday: new Date().toISOString(),
            phone: "(21) 98999-9999",
            address: {
              cep: "90830-563",
              street: 'Rua sei lá oque',
              city: 'City lalalal',
              number: '510',
              state: 'AC',
              neighborhood: 'Lalalal',
              addressDetail: '123123LJASDHJHD',
        }}

        await server.post("/enrollments").set("Authorization", `Bearer ${token}`).send(body);
        const enrollment = await prisma.enrollment.findFirst();
        enrollmentId = enrollment.id

        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.text).toBe("We couldn't find user ticket");
    });

    it ("should respond with status 402 if have enrollment but ticket remote", async () => {
    
        const ticketTypeRemote = await prisma.ticketType.create({
            data: {
                name: "remote ticket",
                price: 1500, 
                isRemote: true,
                includesHotel: false
            }
        })


        hotelTicketType = ticketTypeRemote.id;
        const body = {
            ticketTypeId: hotelTicketType
        }


        await server.post("/tickets").set("Authorization", `Bearer ${token}`).send(body);


        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(402);
        expect(response.text).toBe("Your ticket doesn't includes hotel")
    });

    it ("should respond with status 402 if have enrollment but ticket doesn't includes hotel", async () => {

        await prisma.ticket.deleteMany();
    
        const ticketTypeNoHotel = await prisma.ticketType.create({
            data: {
                name: "no hotel ticket",
                price: 1500, 
                isRemote: false,
                includesHotel: false
            }
        })


        hotelTicketType = ticketTypeNoHotel.id;
        const body = {
            ticketTypeId: hotelTicketType
        }


        await server.post("/tickets").set("Authorization", `Bearer ${token}`).send(body);


        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`)

        expect(response.text).toBe("Your ticket doesn't includes hotel")

        expect(response.status).toBe(402);
        
    });

    it ("should respond with status 402 when ticket includes hotel but isn't paid", async () => {

        await prisma.ticket.deleteMany();
    
        const ticketTypeWithHotel = await prisma.ticketType.create({
            data: {
                name: "hotel ticket",
                price: 1500, 
                isRemote: false,
                includesHotel: true
            }
        })


        hotelTicketType = ticketTypeWithHotel.id;
        const body = {
            ticketTypeId: hotelTicketType
        }


        const ticket = await server.post("/tickets").set("Authorization", `Bearer ${token}`).send(body);
        ticketId = ticket.body.id


        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(402);
        expect(response.text).toBe("Your ticket isn't paid yet")
    });

    it ("should respond with status 404 when doesn't have any hotel", async () => {

        const cardData = {
            issuer: 'teste123',
            number: 1234123412341234,
            name: 'MASTERCARD',
            expirationDate: new Date().toISOString,
            cvv: 744
        }

     const body = {
        ticketId,
        cardData
     }

    await server.post('/payments/process').set("Authorization", `Bearer ${token}`).send(body);



        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.text).toBe("We couldn't find any hotel")
    });

    it ("should respond with status 200 when user has enrollment/paidticket with includes hotel and have hotel listed", async () => {

        const data = {
            name: "Drivensort",
            image: "https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }

       const hotel = await prisma.hotel.create({
        data
       })

        const response = await server.get('/hotels').set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
    });
})