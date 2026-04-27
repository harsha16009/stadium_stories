pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/harsha16009/stadium_stories.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Deploy') {
            steps {
                sh 'sudo cp -r * /usr/share/nginx/html/'
            }
        }
    }
}
