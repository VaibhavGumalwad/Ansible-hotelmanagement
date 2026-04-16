package com.hotel.booking.controller;

import com.hotel.booking.model.Hotel;
import com.hotel.booking.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping("/hotels/all")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/owner/hotels")
    public ResponseEntity<List<Hotel>> getOwnerHotels(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hotelService.getOwnerHotels(userDetails.getUsername()));
    }

    @PostMapping("/owner/hotels")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hotelService.createHotel(hotel, userDetails.getUsername()));
    }

    @PutMapping("/owner/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel, userDetails.getUsername()));
    }

    @DeleteMapping("/owner/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        hotelService.deleteHotel(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
