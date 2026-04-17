# Jenkins AWS Credentials Setup Guide

## Step 1: Create AWS IAM User for Jenkins

### 1.1 Create IAM User
```bash
# Login to AWS Console → IAM → Users → Create User
User Name: jenkins-terraform-user
Access Type: Programmatic access
```

### 1.2 Attach Required Policies
Attach these AWS managed policies:
- `AmazonEC2FullAccess`
- `AmazonRDSFullAccess` 
- `AmazonECRFullAccess`
- `IAMFullAccess`
- `AmazonSSMFullAccess`
- `ElasticLoadBalancingFullAccess`

### 1.3 Save Credentials
- **Access Key ID**: `AKIA...` (save this)
- **Secret Access Key**: `xyz123...` (save this)

## Step 2: Add AWS Credentials to Jenkins

### 2.1 Access Jenkins Credentials
1. Open Jenkins Dashboard
2. Go to **Manage Jenkins** → **Manage Credentials**
3. Click on **(global)** domain
4. Click **Add Credentials**

### 2.2 Configure AWS Credentials
- **Kind**: `AWS Credentials`
- **ID**: `aws-credentials` (exactly this - used in Jenkinsfile)
- **Description**: `AWS Credentials for Terraform`
- **Access Key ID**: `[Your AWS Access Key]`
- **Secret Access Key**: `[Your AWS Secret Key]`
- Click **OK**

## Step 3: Add Other Required Credentials

### 3.1 Database Username
- **Kind**: `Secret text`
- **ID**: `DB_USERNAME`
- **Secret**: `admin`

### 3.2 Database Password
- **Kind**: `Secret text`
- **ID**: `DB_PASSWORD`
- **Secret**: `YourSecurePassword123!`

### 3.3 JWT Secret
- **Kind**: `Secret text`
- **ID**: `JWT_SECRET`
- **Secret**: `your-jwt-secret-key-here`

## Step 4: Verify Jenkins Plugins

Ensure these plugins are installed:
- **AWS Credentials Plugin**
- **Pipeline: AWS Steps**
- **Amazon ECR Plugin**

Install via: **Manage Jenkins** → **Manage Plugins** → **Available**

## Step 5: Test Configuration

### 5.1 Test AWS CLI Access
Create a test pipeline:
```groovy
pipeline {
    agent any
    stages {
        stage('Test AWS') {
            steps {
                withCredentials([aws(credentialsId: 'aws-credentials', 
                               accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                               secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh 'aws sts get-caller-identity'
                    sh 'aws ec2 describe-regions --region us-east-1'
                }
            }
        }
    }
}
```

## Step 6: Security Best Practices

### 6.1 Credential Rotation
- Rotate AWS keys every 90 days
- Update Jenkins credentials accordingly

### 6.2 Least Privilege
- Review and minimize IAM permissions
- Use specific resource ARNs where possible

### 6.3 Monitoring
- Enable CloudTrail for API monitoring
- Monitor Jenkins credential usage

## Troubleshooting

### Common Issues:

1. **"Unable to load AWS credentials"**
   - Check credential ID matches exactly: `aws-credentials`
   - Verify AWS Credentials plugin is installed

2. **"Access Denied" errors**
   - Check IAM user has required policies
   - Verify region is correct (us-east-1)

3. **"Invalid credentials" for ECR**
   - Ensure ECR permissions are attached
   - Check AWS region matches ECR region

### Debug Commands:
```bash
# Test AWS credentials
aws sts get-caller-identity

# Test ECR access
aws ecr describe-repositories --region us-east-1

# Test Parameter Store access
aws ssm describe-parameters --region us-east-1
```

## Final Verification

Your Jenkins credentials should show:
- ✅ `aws-credentials` (AWS Credentials)
- ✅ `DB_USERNAME` (Secret text)
- ✅ `DB_PASSWORD` (Secret text)  
- ✅ `JWT_SECRET` (Secret text)

Now your pipeline will authenticate with AWS automatically! 🚀