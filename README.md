# Group Name: `UNTITLED`

## Institution Name: `Daffodil International University`

# Email:

- Member 1: sajitmotiullah@gmail.com
- Member 2: mrhasan660066@gmail.com
- Member 3: mi.mahade058@gmail.com

# API Documentation

- Sheet Link: https://docs.google.com/spreadsheets/d/1DtEu9-qYtrhkGDKEN2DadbuO-ynYGQt1i8SDe86Fsd0

# Diagrams

- Entity Relationship Diagram: https://drive.google.com/file/d/18Qd322e2XIOW4yJFiRzCzaL8FT5g5vji/view?usp=sharing
- End to End Activity Diagram: https://drive.google.com/file/d/1WfjbJoUrGtROzp0CiPCxlEgyz04LQ6u5/view?usp=sharing
- Backend Workflow Diagram: https://drive.google.com/file/d/1AX46QPvwHeaMVNcq2aTHplachvk8p9Fs/view?usp=sharing

# UI Prototype

- Figma Link: https://www.figma.com/file/qpdroqomjyDiFUehyZjEpz/Code-Samurai?type=design&node-id=0%3A1&mode=design&t=WHzwZvujaf3xyiyD-1

# Powerpoint Presentation

- PPT Link: https://www.canva.com/design/DAGBIUwjLxM/I-H5stAuFXjT-h4O5OYXDA/edit

# Video Recording of the Project with voiceover

- Drive Link: https://drive.google.com/file/d/1mXeCFukPlbPT-U0lHyT2ybto4DMHaT5O/view?usp=sharing

# Ecosync Application README

Welcome to the Ecosync application! This document provides guidance on setting up and running the application for testing purposes.

## Logging In

### System Admin

- Username: systemAdmin
- Password: test

### STS Manager

- Username: stsManager
- Password: test

### Landfill Manager

- Username: landfillManager
- Password: test

Please use the above credentials to log in to the respective roles within the application.

## Running the Application

To start the application, follow these steps:

1. Run Docker Compose:

   ```
   docker-compose up
   ```

2. Frontend:

   - Navigate to `ecosync-frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Run the development server:
     ```
     npm run dev
     ```

3. Backend:
   - Navigate to `ecosync-backend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Run the development server:
     ```
     npm run watch
     ```
   - Run the backend server:
     ```
     npm run dev
     ```

## Demo Data

We've preloaded the application with demo data to facilitate testing. Feel free to explore and interact with the application using the provided credentials.

# Worker Tracking System for Waste Management using BLE

## Overview
In many waste management systems, especially in regions where workers may not have access to smartphones or advanced technology, tracking the activity and productivity of workers poses a significant challenge. Our solution leverages low-cost Bluetooth devices attached to dump trucks to monitor and record the frequency of worker interactions with the vehicle, thereby indirectly tracking worker activity.

## Technology
The system utilizes Bluetooth technology to detect the presence of workers when they come into proximity with a dump truck equipped with a Bluetooth beacon. Each worker is issued a simple, inexpensive Bluetooth-enabled device, which is registered on our system with a unique identifier (MAC address).

## How It Works
1. **Bluetooth Device Setup:**
   - A Bluetooth beacon is installed on each dump truck.
   - Workers are provided with a Bluetooth device, and the MAC address of each device is registered through our admin panel.

2. **Detection and Data Collection:**
   - When a worker approaches the dump truck to dispose of waste, the beacon detects their device.
   - The system logs each interaction, capturing the date, time, and identifier of the worker's device.

3. **Data Upload and Processing:**
   - The data collected by the Bluetooth system is periodically uploaded to our servers.
   - We process this data to calculate metrics such as the total number of trips made by each worker to the dump truck, which serves as an indicator of their activity and effectiveness.

## Benefits
- **Low Cost:** The solution is cost-effective, as it requires minimal hardware and can be implemented using existing technology.
- **Non-Invasive:** No need for workers to interact with the system or carry smartphones; the tracking is automatic and unobtrusive.
- **Scalable:** Easily scalable to multiple trucks and locations with minimal incremental cost.
