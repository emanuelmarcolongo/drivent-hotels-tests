import hotelRepository from "@/repositories/hotels-repository";


async function getHotels(userId: number) {

    const enrollment = await hotelRepository.getEnrollment(userId);

    if (!enrollment) {
        throw {type: 'NotFound', message: `We couldn't find user enrollment`}
    }
    
    const enrollmentId = enrollment.id
    const ticket = await hotelRepository.getTicketByEnrollmentId(enrollmentId);
    if (!ticket) {
        throw {type: 'NotFound', message: `We couldn't find user ticket`}
    }

    if (!ticket.TicketType.includesHotel) {
        throw {type: 'Payment Required', message: `Your ticket doesn't includes hotel`}
    } else if (ticket.TicketType.isRemote) {
        throw {type: 'Payment Required', message: `Your ticket is remote - therefore doesn't includes hotel`}
    } else if (ticket.status === 'RESERVED') {
        throw {type: 'Payment Required', message: `Your ticket isn't paid yet`} 
    }

    const data = await hotelRepository.getHotels();

    if (!data) {
        throw {type: 'NotFound', message: `We couldn't find any hotel`}
    }

    return data;
}

async function getHotelbyId(userId: number, hotel_id: number) {

    
    const enrollment = await hotelRepository.getEnrollment(userId);

    if (!enrollment) {
        throw {type: 'NotFound', message: `We couldn't find user enrollment`}
    }
    
    const enrollmentId = enrollment.id
    const ticket = await hotelRepository.getTicketByEnrollmentId(enrollmentId);
    if (!ticket) {
        throw {type: 'NotFound', message: `We couldn't find user ticket`}
    }

    if (!ticket.TicketType.includesHotel) {
        throw {type: 'Payment Required', message: `Your ticket doesn't includes hotel`}
    } else if (ticket.TicketType.isRemote) {
        throw {type: 'Payment Required', message: `Your ticket is remote - therefore doesn't includes hotel`}
    } else if (ticket.status === 'RESERVED') {
        throw {type: 'Payment Required', message: `Your ticket isn't paid yet`} 
    }

    const data = await hotelRepository.getHotelbyId(hotel_id);

    if (!data) {
        throw {type: 'NotFound', message: `We couldn't find any hotel`}
    }

    return data;
}


const hotelService = {
    getHotels,
    getHotelbyId
}

export default hotelService;