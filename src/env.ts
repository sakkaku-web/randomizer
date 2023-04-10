interface Environment {
  API_URL: string;
}

const devEnv: Environment = {
  API_URL: "http://localhost:5000/",
};

const prodEnv: Environment = {
  API_URL: "http://localhost:8080/",
};

export const env = process.env.NODE_ENV === "production" ? prodEnv : devEnv;
