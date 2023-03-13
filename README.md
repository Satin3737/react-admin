## Local setup flow

1. Create `.env` file:
    ```shell
    Create and fill .env fill with next fields:
   
   IP=127.0.0.1
   APP_NAME=app-name
   DOMAIN=app-domain
   DB_HOST=mysql
   DB_NAME=db-name
   DB_ROOT_PASSWORD=password
   DB_USER=user
   DB_PASSWORD=password
   
    ```

2. Add the domain to the `hosts` file:
    ```shell
    127.0.0.1 app-domain
    ```

3. Run docker:
    ```shell
    docker-compose up
    ```

4. Use phpmyadmin if nedeed:
    ```shell
    phpmyadmin on route localhost:8080
    ```