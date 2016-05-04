-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 04, 2016 at 08:48 AM
-- Server version: 10.0.23-MariaDB-0ubuntu0.15.10.1
-- PHP Version: 5.6.11-1ubuntu3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `techtest`
--

-- --------------------------------------------------------

--
-- Table structure for table `carer`
--

CREATE TABLE `carer` (
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `postcode` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `carer`
--

INSERT INTO `carer` (`name`, `postcode`, `latitude`, `longitude`, `id`) VALUES
('Bob Diamond', 'E12 5AA', 51.5519, 0.0461996, 91),
('Amy Winehouse', 'BS8 3PZ', 51.4557, -2.64287, 92),
('James Bond', 'S10 3ER', 53.3714, -1.50563, 93),
('Homer Simpson', 'S7 1DP', 53.3642, -1.4799, 94),
('Kiera Knightley', 'SE11 4LD', 51.4867, -0.111805, 95),
('Emma Watson', 'EC1Y 2AA', 51.5222, -0.0874757, 96);

-- --------------------------------------------------------

--
-- Table structure for table `carer_skills`
--

CREATE TABLE `carer_skills` (
  `carer_id` int(11) NOT NULL,
  `skills_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `carer_skills`
--

INSERT INTO `carer_skills` (`carer_id`, `skills_id`) VALUES
(91, 81),
(91, 82),
(91, 83),
(91, 84),
(91, 85),
(91, 86),
(92, 81),
(92, 82),
(92, 83),
(92, 84),
(92, 85),
(92, 86),
(92, 87),
(92, 88),
(92, 89),
(92, 90),
(92, 91),
(92, 92),
(92, 93),
(93, 94),
(93, 95),
(93, 96),
(94, 89),
(94, 90),
(94, 91),
(94, 92),
(94, 93),
(94, 97),
(95, 97),
(95, 98),
(95, 99),
(95, 100),
(96, 84),
(96, 85),
(96, 86),
(96, 87),
(96, 88),
(96, 89),
(96, 90),
(96, 91),
(96, 92),
(96, 93);

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`name`, `id`) VALUES
('Visual impairment', 81),
('Deafness', 82),
('COPD', 83),
('Stroke', 84),
('Learning disability', 85),
('Depression', 86),
('Schizophrenia', 87),
('Autism', 88),
('Traumatic brain injury', 89),
('Multiple sclerosis', 90),
('Cerebral palsy', 91),
('Orthopaedic injuries', 92),
('Alzheimer’s dementia', 93),
('Physical disability', 94),
('Cancer', 95),
('Motor neurone disease', 96),
('Vascular dementia', 97),
('Parkinson’s dementia', 98),
('Spinal injury care', 99),
('Terminal illness', 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carer`
--
ALTER TABLE `carer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carer_skills`
--
ALTER TABLE `carer_skills`
  ADD KEY `carer_id_index` (`carer_id`),
  ADD KEY `skills_id_index` (`skills_id`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carer`
--
ALTER TABLE `carer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
