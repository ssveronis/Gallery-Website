-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: mariadb:3306
-- Χρόνος δημιουργίας: 07 Μάη 2025 στις 21:11:44
-- Έκδοση διακομιστή: 11.3.2-MariaDB-1:11.3.2+maria~ubu2204
-- Έκδοση PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `gallery`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `AVAIL_TICKETS`
--

CREATE TABLE `AVAIL_TICKETS` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `max_tickets` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `AVAIL_TICKETS`
--

INSERT INTO `AVAIL_TICKETS` (`id`, `date`, `start_time`, `end_time`, `max_tickets`, `category_id`) VALUES
(1, '2025-05-04', '11:00:00', '12:00:00', 15, 1),
(2, '2025-05-07', '11:00:00', '12:00:00', 15, 1),
(3, '2025-05-07', '12:00:00', '13:00:00', 15, 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `EMAIL`
--

CREATE TABLE `EMAIL` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `newsletter` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `EMAIL`
--

INSERT INTO `EMAIL` (`id`, `email`, `newsletter`) VALUES
(1, 'abc@example.com', 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `PERSON`
--

CREATE TABLE `PERSON` (
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_country` int(4) NOT NULL DEFAULT 30,
  `phone_number` int(10) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `PERSON`
--

INSERT INTO `PERSON` (`first_name`, `last_name`, `phone_country`, `phone_number`, `id`) VALUES
('Μάκης', 'Κοτσάμπασης', 30, 1234567890, 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `TICKETS_CATEGORY`
--

CREATE TABLE `TICKETS_CATEGORY` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `regular_price` float NOT NULL,
  `children_price` float NOT NULL,
  `student_price` float NOT NULL,
  `audioguide_price` float DEFAULT NULL,
  `can_acc_AMEA` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `TICKETS_CATEGORY`
--

INSERT INTO `TICKETS_CATEGORY` (`id`, `name`, `regular_price`, `children_price`, `student_price`, `audioguide_price`, `can_acc_AMEA`) VALUES
(1, 'TEST 1', 15, 5, 10, 2, 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `TICKET_SALES`
--

CREATE TABLE `TICKET_SALES` (
  `id` int(11) NOT NULL,
  `regular_tickets` int(11) NOT NULL DEFAULT 0,
  `children_tickets` int(11) NOT NULL DEFAULT 0,
  `student_tickets` int(11) NOT NULL DEFAULT 0,
  `audioguides` int(11) NOT NULL DEFAULT 0,
  `accessibility` tinyint(1) NOT NULL DEFAULT 0,
  `buyer_id` int(11) NOT NULL,
  `avail_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `TICKET_SALES`
--

INSERT INTO `TICKET_SALES` (`id`, `regular_tickets`, `children_tickets`, `student_tickets`, `audioguides`, `accessibility`, `buyer_id`, `avail_id`) VALUES
(1, 1, 0, 0, 1, 0, 1, 1),
(2, 3, 0, 0, 1, 0, 1, 2);

-- --------------------------------------------------------

--
-- Στημένη δομή για προβολή `view_ticket_sales_summary`
-- (Δείτε παρακάτω για την πραγματική προβολή)
--
CREATE TABLE `view_ticket_sales_summary` (
`category_id` int(11)
,`id` int(11)
,`date` date
,`start_time` time
,`end_time` time
,`max_tickets` int(11)
,`total_regular_tickets` decimal(32,0)
,`total_children_tickets` decimal(32,0)
,`total_student_tickets` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `WP_USERS`
--

CREATE TABLE `WP_USERS` (
  `id` int(11) NOT NULL,
  `user_login` varchar(25) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `email_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `WP_USERS`
--

INSERT INTO `WP_USERS` (`id`, `user_login`, `user_pass`, `display_name`, `email_id`) VALUES
(1, 'test', 'test', 'test account', 1);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `AVAIL_TICKETS`
--
ALTER TABLE `AVAIL_TICKETS`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`,`start_time`,`end_time`),
  ADD KEY `category_id` (`category_id`);

--
-- Ευρετήρια για πίνακα `EMAIL`
--
ALTER TABLE `EMAIL`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `e-mail` (`email`);

--
-- Ευρετήρια για πίνακα `PERSON`
--
ALTER TABLE `PERSON`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `TICKETS_CATEGORY`
--
ALTER TABLE `TICKETS_CATEGORY`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `TICKET_SALES`
--
ALTER TABLE `TICKET_SALES`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `avail_id` (`avail_id`);

--
-- Ευρετήρια για πίνακα `WP_USERS`
--
ALTER TABLE `WP_USERS`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_login` (`user_login`),
  ADD UNIQUE KEY `email_id` (`email_id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `AVAIL_TICKETS`
--
ALTER TABLE `AVAIL_TICKETS`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT για πίνακα `EMAIL`
--
ALTER TABLE `EMAIL`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `TICKETS_CATEGORY`
--
ALTER TABLE `TICKETS_CATEGORY`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `TICKET_SALES`
--
ALTER TABLE `TICKET_SALES`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT για πίνακα `WP_USERS`
--
ALTER TABLE `WP_USERS`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- --------------------------------------------------------

--
-- Δομή για προβολή `view_ticket_sales_summary`
--
DROP TABLE IF EXISTS `view_ticket_sales_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_ticket_sales_summary`  AS SELECT `AVAIL_TICKETS`.`category_id` AS `category_id`, `AVAIL_TICKETS`.`id` AS `id`, `AVAIL_TICKETS`.`date` AS `date`, `AVAIL_TICKETS`.`start_time` AS `start_time`, `AVAIL_TICKETS`.`end_time` AS `end_time`, `AVAIL_TICKETS`.`max_tickets` AS `max_tickets`, sum(`TICKET_SALES`.`regular_tickets`) AS `total_regular_tickets`, sum(`TICKET_SALES`.`children_tickets`) AS `total_children_tickets`, sum(`TICKET_SALES`.`student_tickets`) AS `total_student_tickets` FROM (`AVAIL_TICKETS` LEFT OUTER JOIN `TICKET_SALES` on(`TICKET_SALES`.`avail_id` = `AVAIL_TICKETS`.`id`)) GROUP BY `AVAIL_TICKETS`.`category_id`, `AVAIL_TICKETS`.`date`, `AVAIL_TICKETS`.`start_time`, `AVAIL_TICKETS`.`end_time`, `AVAIL_TICKETS`.`max_tickets` ;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `AVAIL_TICKETS`
--
ALTER TABLE `AVAIL_TICKETS`
  ADD CONSTRAINT `AVAIL_TICKETS_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `TICKETS_CATEGORY` (`id`);

--
-- Περιορισμοί για πίνακα `PERSON`
--
ALTER TABLE `PERSON`
  ADD CONSTRAINT `PERSON_ibfk_1` FOREIGN KEY (`id`) REFERENCES `EMAIL` (`id`);

--
-- Περιορισμοί για πίνακα `TICKET_SALES`
--
ALTER TABLE `TICKET_SALES`
  ADD CONSTRAINT `TICKET_SALES_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `PERSON` (`id`),
  ADD CONSTRAINT `TICKET_SALES_ibfk_2` FOREIGN KEY (`avail_id`) REFERENCES `AVAIL_TICKETS` (`id`);

--
-- Περιορισμοί για πίνακα `WP_USERS`
--
ALTER TABLE `WP_USERS`
  ADD CONSTRAINT `WP_USERS_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `EMAIL` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
