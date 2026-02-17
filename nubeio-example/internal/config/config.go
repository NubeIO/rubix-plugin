package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port        int
	JWTSecret   string
	Environment string
	DBPath      string
}

func Load(_ string) (*Config, error) {
	port := 8081
	if p := os.Getenv("PORT"); p != "" {
		if n, err := strconv.Atoi(p); err == nil {
			port = n
		}
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-me"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./storage/projectmgmt.db"
	}

	env := os.Getenv("ENVIRONMENT")
	if env == "" {
		env = "development"
	}

	return &Config{
		Port:        port,
		JWTSecret:   jwtSecret,
		Environment: env,
		DBPath:      dbPath,
	}, nil
}
