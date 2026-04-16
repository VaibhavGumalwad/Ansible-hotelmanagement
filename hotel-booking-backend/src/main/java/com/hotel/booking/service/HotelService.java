package com.hotel.booking.service;

import com.hotel.booking.model.Hotel;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.HotelRepository;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> getOwnerHotels(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        return hotelRepository.findByOwnerId(owner.getId());
    }

    public Hotel createHotel(Hotel hotel, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        hotel.setOwner(owner);
        hotel.setAvailableRooms(hotel.getTotalRooms());
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel updated, String ownerEmail) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow();
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        hotel.setName(updated.getName());
        hotel.setLocation(updated.getLocation());
        hotel.setDescription(updated.getDescription());
        hotel.setPricePerNight(updated.getPricePerNight());
        hotel.setTotalRooms(updated.getTotalRooms());
        hotel.setAmenities(updated.getAmenities());
        hotel.setImageUrl(updated.getImageUrl());
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id, String ownerEmail) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow();
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        hotelRepository.delete(hotel);
    }
}
