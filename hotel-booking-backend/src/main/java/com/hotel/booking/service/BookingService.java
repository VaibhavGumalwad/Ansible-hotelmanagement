package com.hotel.booking.service;

import com.hotel.booking.model.Booking;
import com.hotel.booking.model.Hotel;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.HotelRepository;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Long hotelId, Booking booking, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail).orElseThrow();
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow();

        if (hotel.getAvailableRooms() < booking.getRooms()) {
            throw new RuntimeException("Not enough rooms available");
        }

        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        if (nights <= 0) throw new RuntimeException("Invalid dates");

        booking.setCustomer(customer);
        booking.setHotel(hotel);
        booking.setTotalAmount(nights * hotel.getPricePerNight() * booking.getRooms());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        hotel.setAvailableRooms(hotel.getAvailableRooms() - booking.getRooms());
        hotelRepository.save(hotel);

        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail).orElseThrow();
        return bookingRepository.findByCustomerId(customer.getId());
    }

    public List<Booking> getOwnerBookings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        return bookingRepository.findByHotelOwnerId(owner.getId());
    }

    public Booking cancelBooking(Long bookingId, String customerEmail) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getCustomer().getEmail().equals(customerEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Hotel hotel = booking.getHotel();
        hotel.setAvailableRooms(hotel.getAvailableRooms() + booking.getRooms());
        hotelRepository.save(hotel);
        return bookingRepository.save(booking);
    }
}
