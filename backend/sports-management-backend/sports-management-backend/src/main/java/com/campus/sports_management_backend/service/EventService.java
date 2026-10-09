package com.campus.sports_management_backend.service;

import com.campus.sports_management_backend.dto.SportsEventRequest;
import com.campus.sports_management_backend.entity.Sport;
import com.campus.sports_management_backend.entity.SportsEvent;
import com.campus.sports_management_backend.exception.ResourceNotFoundException;
import com.campus.sports_management_backend.repository.SportRepository;
import com.campus.sports_management_backend.repository.SportsEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EventService {

    private final SportsEventRepository sportsEventRepository;
    private final SportRepository sportRepository;

    public EventService(SportsEventRepository sportsEventRepository, SportRepository sportRepository) {
        this.sportsEventRepository = sportsEventRepository;
        this.sportRepository = sportRepository;
    }

    public List<SportsEvent> getAllEvents() {
        return sportsEventRepository.findAllByOrderByEventDateDesc();
    }

    public List<SportsEvent> getUpcomingEvents() {
        return sportsEventRepository.findByStatusOrderByEventDateAsc("UPCOMING");
    }

    @Transactional
    public SportsEvent createEvent(SportsEventRequest request) {
        Sport sport = null;
        if (request.getSportId() != null) {
            sport = sportRepository.findById(request.getSportId()).orElse(null);
        }

        String sportName = request.getSportName();
        if (sportName == null && sport != null) {
            sportName = sport.getName();
        }

        SportsEvent event = new SportsEvent(
                request.getEventName(),
                sport,
                sportName,
                request.getEventDate(),
                request.getVenue(),
                request.getDescription(),
                request.getStatus() != null ? request.getStatus() : "UPCOMING"
        );

        return sportsEventRepository.save(event);
    }

    @Transactional
    public SportsEvent updateEvent(Long id, SportsEventRequest request) {
        SportsEvent event = sportsEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sports Event not found with ID: " + id));

        if (request.getEventName() != null) event.setEventName(request.getEventName());
        if (request.getEventDate() != null) event.setEventDate(request.getEventDate());
        if (request.getVenue() != null) event.setVenue(request.getVenue());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getStatus() != null) event.setStatus(request.getStatus());

        if (request.getSportId() != null) {
            Sport sport = sportRepository.findById(request.getSportId()).orElse(null);
            event.setSport(sport);
            if (sport != null) event.setSportName(sport.getName());
        }

        return sportsEventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!sportsEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sports Event not found with ID: " + id);
        }
        sportsEventRepository.deleteById(id);
    }

    public long countUpcomingEvents() {
        return sportsEventRepository.countByStatus("UPCOMING");
    }
}
