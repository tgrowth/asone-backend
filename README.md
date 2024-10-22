# Server Deployment Instructions

### 1. Install Terraform

First, you need to install Terraform on your system. Follow the official installation guide: https://www.terraform.io/downloads.

### 2. Create a User on AWS

You will need to request Taalaai to create an AWS user for you. Taalaai is the owner and has the permissions required to create users. Note that I am an admin but do not have deployment rights to create users.

### 3. Deploy the Server

Once the AWS user is created, you can deploy the server using Terraform.

1. Open your terminal within your IDE.
2. Navigate to the `terraform` folder:
    
    ```bash
    cd terraform
    ```
    
3. Run the following command to apply the Terraform configuration and update the server:
    
    ```bash
    terraform apply
    ```
    

> Important: This command pushes the changes and updates the server every time.
> 

### 4. Testing

After running `terraform apply`, the server will be updated and ready for testing in about 8-9 minutes. You can begin testing approximately 10 minutes after deploying.
