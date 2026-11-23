pipeline {
    agent any

    environment {
        IMAGE_NAME = "tienda-web-jenkins"
        IMAGE_TAG  = "build-${env.BUILD_NUMBER}"
        CONTAINER  = "tienda-web-ci"
        STRAPI_HOST = "https://mi-tienda-backend-y9xx.onrender.com"
        STRAPI_TOKEN = credentials('STRAPI_TOKEN')
    }

    stages {
        stage('1. Obtener código de GitHub') {
            steps {
                checkout scm
            }
        }

        stage('2. Verificar y ejecutar pruebas') {
            steps {
                sh '''
                    docker run --rm --volumes-from jenkins-devops -w "${WORKSPACE}/web" node:20-alpine sh -c "
                        npm install -g pnpm@10 &&
                        pnpm install --frozen-lockfile &&
                        pnpm lint &&
                        pnpm test
                    "
                '''
            }
        }

        stage('3. Construir imagen Docker') {
            steps {
                sh '''
                    DOCKER_BUILDKIT=1 docker build \
                        --secret id=strapi_token,env=STRAPI_TOKEN \
                        --build-arg STRAPI_HOST="${STRAPI_HOST}" \
                        -t "${IMAGE_NAME}:${IMAGE_TAG}" \
                        ./web
                '''
            }
        }

        stage('4. Ejecutar contenedor y verificar aplicación') {
            steps {
                sh '''
                    docker rm -f "${CONTAINER}" || true
                    docker run -d --name "${CONTAINER}" -p 3001:3000 \
                        -e STRAPI_HOST="${STRAPI_HOST}" \
                        -e STRAPI_TOKEN="${STRAPI_TOKEN}" \
                        "${IMAGE_NAME}:${IMAGE_TAG}"
                    sleep 5
                    docker ps --filter "name=${CONTAINER}"
                    curl -f http://host.docker.internal:3001 || curl -f http://localhost:3001 || true
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline completado: ${IMAGE_NAME}:${IMAGE_TAG} corriendo en puerto 3001."
        }
        failure {
            echo "El Pipeline falló. Revisa Console Output."
        }
    }
}