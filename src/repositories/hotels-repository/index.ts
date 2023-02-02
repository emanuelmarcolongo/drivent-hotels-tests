import { prisma } from "@/config";

async function getHotels () {

    const data = await prisma.hotel.findMany();
    return data;
}

async function getEnrollment(userId: number) {
    const data = await prisma.enrollment.findFirst({
        where: {userId}
    })
    return data;
}

async function getTicketByEnrollmentId(enrollmentId: number) {
    const data = await prisma.ticket.findFirst({
        where: {enrollmentId},
        include: {TicketType: true}
    })

    return data;
}

const hotelRepository = {
    getHotels,
    getEnrollment,
    getTicketByEnrollmentId
}

export default hotelRepository;