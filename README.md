Memento 🖼️

    Your personal photo gallery in the cloud. Accessible anywhere, anytime.

Memento is a web application that provides a secure and user-friendly platform, much like Google Photos, to store your personal photos. It allows you to upload your memories, organize them in a beautiful gallery, and access them from any device. You can easily view your photos or download them back to your device whenever you need.

✨ Features

    🔐 Secure User Authentication: Register and log in to access your personal and private photo gallery.

    🚀 Bulk Photo Uploads: Easily upload a single photo or multiple photos at once.

    🖼️ Intuitive Gallery View: Browse all your uploaded photos in a clean, user-friendly thumbnail grid.

    📥 Simple Downloads: Download any photo back to your device with a single click.

    🗑️ Flexible Deletion: Remove one or multiple photos from your gallery at a time.

    ℹ️ Photo Details: View properties of your photos, such as filename, resolution, and size.

🛠️ Tech Stack

    Frontend: React, HTML, CSS, JavaScript

    Backend: Node.js, Express.js

    Database: MongoDB Atlas

    Cloud Storage: Cloudinary for photo hosting and management.

    Deployment: Not yet deployed.

🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

You'll need the following software installed on your machine:

    Git

    Node.js (v18.x or later is recommended)

    npm (Node Package Manager), which comes with Node.js

Installation & Setup

    Clone the repository
    Open your terminal and run the following command:
    Bash

git clone https://github.com/mar1fatih/memento.git

(Note: You will need to replace memento with your actual repository name if it's different.)

Navigate to the project directory
Bash

cd memento

Set up the Backend

    Navigate to the backend folder:
    Bash

cd backend

Install the required npm packages:
Bash

npm install

Create a .env file in the backend directory. You will need to add the following required variables:
Code snippet

    # .env file in the 'backend' directory
    PORT=5000
    MONGODB_URI="your_mongodb_connection_string"
    CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUD_API_KEY="your_cloudinary_api_key"
    CLOUD_API_SECRET="your_cloudinary_api_secret"
    JWT_SECRET="your_strong_secret_for_jwt"

Set up the Frontend

    From the root memento directory, navigate to the frontend folder:
    Bash

cd ../frontend 

Install the required npm packages:
Bash

        npm install

Running the Application

You will need to open two separate terminal windows or tabs to run both the backend and frontend servers simultaneously.

    Start the Backend Server

        In a terminal at the backend directory, run:
        Bash

    npm start

    Your backend API should now be running, typically on http://localhost:5000.

Start the Frontend Development Server

    In another terminal at the frontend directory, run:
    Bash

        npm run dev

        The application will now be running. Open your web browser and navigate to the URL provided in the terminal (usually http://localhost:5173).

📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

📧 Contact

Marouane Fatih

    GitHub: @mar1fatih

    X (Twitter): @mar1fatih

    LinkedIn: Marouane Fatih

    Email: marouanefatih631@gmail.com