export const SEED_CANDIDATES = [
            {
                id: "c1",
                firstName: "Jan",
                lastName: "Kowalski",
                birthDate: "1994-05-12",
                phone: "601202303",
                assessmentDate: "2026-06-20", 
                department: "Metal",
                stage: "assessment",
                status: "Nowy",
                history: [
                    { timestamp: "10.06.2026 09:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c2",
                firstName: "Marta",
                lastName: "Nowak",
                birthDate: "1990-11-23",
                phone: "789456123",
                assessmentDate: "2026-06-18",
                medicalDate: "2026-06-12",
                department: "Szwalnia",
                stage: "medical",
                status: "Oczekuje",
                history: [
                    { timestamp: "12.06.2026 10:15", fromStage: "Assessment / Testy (AC)", toStage: "Badania lekarskie", fromStatus: "Potwierdzony", toStatus: "Oczekuje" },
                    { timestamp: "08.06.2026 14:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c3",
                firstName: "Robert",
                lastName: "Lewandowski",
                birthDate: "1988-08-21",
                phone: "505404302",
                assessmentDate: "2026-06-01",
                medicalDate: "2026-06-05",
                bhpDate: "2026-06-15",
                department: "Metal",
                stage: "bhp",
                status: "Stawił się",
                history: [
                    { timestamp: "15.06.2026 08:30", fromStage: "Badania lekarskie", toStage: "BHP i zatrudnienie", fromStatus: "Przeszedł", toStatus: "Stawił się" },
                    { timestamp: "05.06.2026 11:00", fromStage: "Assessment / Testy (AC)", toStage: "Badania lekarskie", fromStatus: "Potwierdzony", toStatus: "Oczekuje" },
                    { timestamp: "01.06.2026 10:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c4",
                firstName: "Anna",
                lastName: "Zielińska",
                birthDate: "1997-03-14",
                phone: "888777666",
                assessmentDate: "2026-05-20",
                medicalDate: "2026-05-25",
                reserveDate: "2026-05-26",
                department: "Magazyn",
                stage: "reserve",
                status: "Badania zaliczone",
                reserveStatus: "Badania zaliczone",
                history: [
                    { timestamp: "26.05.2026 13:45", fromStage: "Badania lekarskie", toStage: "Rezerwa", fromStatus: "Do rezerwy", toStatus: "Badania zaliczone" },
                    { timestamp: "25.05.2026 09:15", fromStage: "Assessment / Testy (AC)", toStage: "Badania lekarskie", fromStatus: "Potwierdzony", toStatus: "Oczekuje" },
                    { timestamp: "20.05.2026 11:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c5",
                firstName: "Tomasz",
                lastName: "Mazur",
                birthDate: "1992-07-04",
                phone: "512512512",
                assessmentDate: "2026-05-10",
                department: "Podsofity/PU",
                stage: "reserve",
                status: "Badania nieukończone",
                reserveStatus: "Badania nieukończone",
                reserveDate: "2026-05-12",
                history: [
                    { timestamp: "12.05.2026 15:20", fromStage: "Badania lekarskie", toStage: "Rezerwa", fromStatus: "Do rezerwy", toStatus: "Badania nieukończone" },
                    { timestamp: "10.05.2026 09:30", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c6",
                firstName: "Andrzej",
                lastName: "Przybylski",
                birthDate: "1982-05-16",
                phone: "111222333",
                assessmentDate: "2026-06-01",
                medicalDate: "2026-06-04",
                bhpDate: "2026-06-10",
                hireDate: "2026-06-11",
                department: "Montaż", 
                stage: "hired",
                status: "Zatrudniony",
                history: [
                    { timestamp: "11.06.2026 08:00", fromStage: "BHP i zatrudnienie", toStage: "Zatrudnieni", fromStatus: "Stawił się", toStatus: "Zatrudniony" },
                    { timestamp: "10.06.2026 14:00", fromStage: "Badania lekarskie", toStage: "BHP i zatrudnienie", fromStatus: "Przeszedł", toStatus: "Oczekuje" },
                    { timestamp: "04.06.2026 11:30", fromStage: "Assessment / Testy (AC)", toStage: "Badania lekarskie", fromStatus: "Potwierdzony", toStatus: "Oczekuje" },
                    { timestamp: "01.06.2026 10:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            },
            {
                id: "c7",
                firstName: "Sebastian",
                lastName: "Kamil",
                birthDate: "1999-12-01",
                phone: "700800900",
                assessmentDate: "2026-06-12",
                department: "Metal",
                stage: "rejected",
                status: "Nie stawił się na assessment",
                rejectionStage: "Assessment (AC)",
                rejectionReason: "Nie stawił się na assessment",
                rejectionDate: "2026-06-12",
                history: [
                    { timestamp: "12.06.2026 12:00", fromStage: "Assessment / Testy (AC)", toStage: "Rezygnacje / Nieobecności", fromStatus: "Nowy", toStatus: "Nie stawił się na assessment" },
                    { timestamp: "12.06.2026 08:00", fromStage: "Brak", toStage: "Assessment / Testy (AC)", fromStatus: "Brak", toStatus: "Nowy" }
                ]
            }
        ];

export const SEED_ORDERS = [
            { id: "o1", department: "Metal", count: 3, gender: "Mężczyźni i kobiety", assessmentDate: "2026-06-20" },
            { id: "o2", department: "Szwalnia", count: 5, gender: "Kobiety", assessmentDate: "2026-06-18" },
            { id: "o3", department: "Montaż", count: 2, gender: "Mężczyźni", assessmentDate: "2026-06-12" } 
        ];
