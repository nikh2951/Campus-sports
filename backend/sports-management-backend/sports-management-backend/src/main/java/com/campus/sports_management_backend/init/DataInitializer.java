package com.campus.sports_management_backend.init;

import com.campus.sports_management_backend.entity.*;
import com.campus.sports_management_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SportRepository sportRepository;
    private final EquipmentRepository equipmentRepository;
    private final AdministratorRepository administratorRepository;
    private final SportsEventRepository sportsEventRepository;
    private final StudentRepository studentRepository;
    private final AchievementRepository achievementRepository;

    public DataInitializer(SportRepository sportRepository,
                           EquipmentRepository equipmentRepository,
                           AdministratorRepository administratorRepository,
                           SportsEventRepository sportsEventRepository,
                           StudentRepository studentRepository,
                           AchievementRepository achievementRepository) {
        this.sportRepository = sportRepository;
        this.equipmentRepository = equipmentRepository;
        this.administratorRepository = administratorRepository;
        this.sportsEventRepository = sportsEventRepository;
        this.studentRepository = studentRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) {
        initAdministrators();
        initSportsAndEquipment();
        initEvents();
    }

    private void initAdministrators() {
        if (administratorRepository.count() == 0) {
            Administrator defaultAdmin = new Administrator("ADM001", "Campus Sports Director", "admin@anurag.edu.in");
            administratorRepository.save(defaultAdmin);
            System.out.println("Initialized default Administrator: ADM001 (admin@anurag.edu.in)");
        }
    }

    private void initSportsAndEquipment() {
        if (sportRepository.count() == 0) {
            // Outdoor Sports
            Sport cricket = sportRepository.save(new Sport("Cricket", "OUTDOOR", "University Cricket Facility and Nets"));
            Sport football = sportRepository.save(new Sport("Football", "OUTDOOR", "Full-sized Football Turf"));
            Sport basketball = sportRepository.save(new Sport("Basketball", "OUTDOOR", "Standard Outdoor Basketball Court"));
            Sport volleyball = sportRepository.save(new Sport("Volleyball", "OUTDOOR", "Sand & Clay Volleyball Courts"));
            Sport athletics = sportRepository.save(new Sport("Athletics", "OUTDOOR", "400m Athletic Synthetic Track"));

            // Indoor Sports
            Sport chess = sportRepository.save(new Sport("Chess", "INDOOR", "Chess & Mind Sports Room"));
            Sport carrom = sportRepository.save(new Sport("Carrom", "INDOOR", "Carrom Arena"));
            Sport tableTennis = sportRepository.save(new Sport("Table Tennis", "INDOOR", "Indoor TT Tables"));
            Sport badminton = sportRepository.save(new Sport("Badminton", "INDOOR", "Indoor Wooden Badminton Courts"));

            // Initial Equipment Inventory
            equipmentRepository.save(new Equipment("Cricket Bat (English Willow)", cricket, 15, 15));
            equipmentRepository.save(new Equipment("Leather Cricket Ball Box (6s)", cricket, 10, 10));
            equipmentRepository.save(new Equipment("Wicket Keeper Pads & Gloves", cricket, 5, 5));
            equipmentRepository.save(new Equipment("Pro Leather Football (Size 5)", football, 20, 20));
            equipmentRepository.save(new Equipment("Goalkeeper Gloves", football, 8, 8));
            equipmentRepository.save(new Equipment("Match Basketball (Size 7)", basketball, 15, 15));
            equipmentRepository.save(new Equipment("Volleyball Match Ball", volleyball, 12, 12));
            equipmentRepository.save(new Equipment("Tournament Wooden Chess Set", chess, 25, 25));
            equipmentRepository.save(new Equipment("Carrom Board & Coin Set", carrom, 10, 10));
            equipmentRepository.save(new Equipment("Professional TT Racket", tableTennis, 30, 30));
            equipmentRepository.save(new Equipment("TT Balls Pack (12s)", tableTennis, 15, 15));
            equipmentRepository.save(new Equipment("Carbon Fibre Badminton Racket", badminton, 25, 25));
            equipmentRepository.save(new Equipment("Yonex Shuttlecock Box", badminton, 20, 20));

            System.out.println("Initialized default Sports and Inventory");
        }
    }

    private void initEvents() {
        if (sportsEventRepository.count() == 0) {
            List<Sport> sports = sportRepository.findAll();
            Sport cricket = sports.stream().filter(s -> s.getName().equalsIgnoreCase("Cricket")).findFirst().orElse(null);
            Sport football = sports.stream().filter(s -> s.getName().equalsIgnoreCase("Football")).findFirst().orElse(null);
            Sport tt = sports.stream().filter(s -> s.getName().equalsIgnoreCase("Table Tennis")).findFirst().orElse(null);

            sportsEventRepository.save(new SportsEvent("Annual Inter-Department Cricket Cup", cricket, "Cricket", 
                    LocalDateTime.now().plusDays(5).withHour(10).withMinute(0), "Main Stadium Ground", 
                    "Knockout inter-department cricket championship with 16 competing teams.", "UPCOMING"));

            sportsEventRepository.save(new SportsEvent("Campus Football Premier League", football, "Football", 
                    LocalDateTime.now().plusDays(12).withHour(16).withMinute(30), "Turf Ground 1", 
                    "League matches leading up to finals.", "UPCOMING"));

            sportsEventRepository.save(new SportsEvent("Inter-College Table Tennis Open", tt, "Table Tennis", 
                    LocalDateTime.now().plusDays(20).withHour(9).withMinute(0), "Indoor Sports Complex", 
                    "Open singles and doubles competition for all branches.", "UPCOMING"));

            System.out.println("Initialized default Campus Sports Events");
        }
    }
}
