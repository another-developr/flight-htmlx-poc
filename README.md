# Flight App - Quick Setup

<img width="984" alt="Screenshot 2025-02-01 at 13 34 12" src="https://github.com/user-attachments/assets/70644f6b-2a6c-4fd9-9821-d1f82584c2e4" />

### Install dependencies FE/BE
```
make install
```

### Deploy DB
```
AWS_DEFAULT_REGION=<eu> ... make deploy-db
```

### Destroy DB
```
AWS_DEFAULT_REGION=<eu> ... make destroy-db
```

### Load fixtures
```
AWS_DEFAULT_REGION=<eu> ... make fixtures
```

### Run BE
```
AWS_DEFAULT_REGION=<eu> ... make run-be
```

### Run FE
```
make run-fe
```


