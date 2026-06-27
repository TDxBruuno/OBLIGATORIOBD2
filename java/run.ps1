$env:TICKETING_DB_URL="jdbc:mysql://mysql.reto-ucu.net:50006/XR_Grupo3?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:TICKETING_DB_USER="xr_g3_admin"
$env:TICKETING_DB_PASSWORD="contrase;a"
$env:TICKETING_TOKEN_SECRET="token"
mvn spring-boot:run