# AsOne Backend

AsOne Backend is a Node.js server for the AsOne app, which supports tracking menstrual cycles, managing user data, and offering personalized recommendations for improving relationships. The backend manages user authentication, data storage, and serves personalized insights through a secure and scalable architecture.

## Features

- **User Authentication**: Secure sign-up and login for users.
- **Cycle and Mood Tracking**: Users can log cycle details and moods for personalized insights.
- **Personalized Recommendations**: Tailored tips and insights to help users and their partners understand and support each other.
- **Data Management**: Stores and manages user preferences, quiz results, and onboarding progress.
- **Partner Mode**: Provides simplified information and tips for the user’s partner based on the user’s cycle data.

---

## Tech Stack

- **Node.js**: Backend runtime.
- **Express**: Web framework for API routing and middleware.
- **Firebase**: Manages user authentication and secure login sessions.
- **PostgreSQL**: Database for managing user preferences and application data.
- **AWS**: Hosting for server deployment.
- **Terraform**: Infrastructure as code to automate server deployment.
- **Docker**: Containerization for efficient deployment and consistency.
- **Kubernetes**: Orchestration of Docker containers for high availability and scalability.

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **PostgreSQL**: Make sure you have PostgreSQL installed and running.
- **AWS Account**: Required for deployment.

### Installation

1. **Clone the repository**:
    
    ```bash
    git clone <https://github.com/username/asone-backend.git>
    cd asone-backend
    
    ```
    
2. **Install dependencies**:
    
    ```bash
    npm install
    
    ```
    
3. **Set up Environment Variables**:


4. **Run the server locally**:
    
    ```bash
    npm run dev
    
    ```
    

---

## Server Deployment Instructions

### 1. Install Terraform

Install Terraform by following the official [Terraform Installation Guide](https://www.terraform.io/downloads).

### 2. Create a User on AWS

Request an AWS user creation from your AWS administrator if not already available.

### 3. Deploy the Server

Once the AWS user is set up, deploy the server as follows:

1. **Open terminal** within your IDE.
2. **Navigate** to the `terraform` directory:
    
    ```bash
    cd terraform
    
    ```
    
3. **Run the Terraform apply command**:
    
    ```bash
    terraform apply
    
    ```
    

> Important: Running this command pushes changes and updates the server with the latest configurations.
> 

### 4. Testing

After running `terraform apply`, the server should be up and ready for testing in about 8-9 minutes. Begin testing after approximately 10 minutes to ensure all services are fully initialized.

---

## License

This project is licensed under the MIT License.
