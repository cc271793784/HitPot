### Running the Project

Open the command line and navigate to the root directory of the project.
Run the following command:

```shell
# Open a terminal or command prompt and navigate to the docker-compose directory.
cd docker-compose
# Run the following command to start the services,
docker-compose up -d
# To return to the parent directory,
cd ..
```

> Access the following URL in a browser to view the HIT-POT site: http://localhost:18000

Launch the project, if you are using Linux/MacOS, run:

```shell
./gradlew generateQueryDSL bootRun
```

Or, if you are using Windows, run:

```shell
./gradlew.bat generateQueryDSL bootRun
```

The application will start listening on port 8080. Access the following URL in a browser to view the application interface:
http://localhost:8080


