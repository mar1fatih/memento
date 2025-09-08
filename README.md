# Memento 🖼️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A personal photo gallery in the cloud, accessible anywhere, anytime.

Memento is a web application that provides a secure and user-friendly platform, much like Google Photos, to store your personal photos. It allows you to upload your memories, organize them in a beautiful gallery, and access them from any device. You can easily view your photos or download them back to your device whenever you need.

## ✨ Features

-   🔐 **Secure User Authentication:** Register and log in to access your personal and private photo gallery.
-   🚀 **Bulk Photo Uploads:** Easily upload a single photo or multiple photos at once.
-   🖼️ **Intuitive Gallery View:** Browse all your uploaded photos in a clean, user-friendly thumbnail grid.
-   📥 **Simple Downloads:** Download any photo back to your device with a single click.
-   🗑️ **Flexible Deletion:** Remove one or multiple photos from your gallery at a time.
-   ℹ️ **Photo Details:** View properties of your photos, such as filename, resolution, and size.

## 🛠️ Tech Stack

-   **Frontend:** React, HTML, CSS, JavaScript
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB Atlas
-   **Cloud Storage:** Cloudinary for photo hosting and management.

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

Make sure you have the following software installed:
-   Git
-   Node.js (v18.x or later)
-   npm (which is included with Node.js)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/mar1fatih/memento.git
    cd memento
    ```

2.  **Setup Backend**
    ```sh
    # Navigate into the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create the environment file
    touch .env
    ```
    Now, open the `.env` file and add the following variables with your own credentials:
    ```env
    PORT=5000
    MONGODB_URI="your_mongodb_connection_string"
    CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUD_API_KEY="your_cloudinary_api_key"
    CLOUD_API_SECRET="your_cloudinary_api_secret"
    JWT_SECRET="your_strong_secret_for_jwt"
    ```

3.  **Setup Frontend**
    ```sh
    # Navigate back to the root directory
    cd ..

    # Navigate into the frontend directory
    cd frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You need to run the backend and frontend in two separate terminals.

-   **Terminal 1: Start the Backend**
    ```sh
    # Make sure you are in the 'backend' directory
    cd backend
    npm start
    ```

-   **Terminal 2: Start the Frontend**
    ```sh
    # Make sure you are in the 'frontend' directory
    cd frontend
    npm run dev
    ```
    Your app should now be running locally! Open your browser to the address shown in the frontend terminal (usually `http://localhost:5173`).

## 📜 License

This project is licensed under the MIT License.

## 📧 Contact

**Marouane Fatih**

-   **GitHub:** [@mar1fatih](https://github.com/mar1fatih)
-   **X (Twitter):** [@mar1fatih](https://x.com/mar1fatih)
-   **LinkedIn:** [Marouane Fatih](https://www.linkedin.com/in/marouane-fatih-b86952192)
-   **Email:** marouanefatih631@gmail.com