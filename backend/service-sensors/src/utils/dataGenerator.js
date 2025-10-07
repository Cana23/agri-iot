import faker from "faker";

export const generateSensorData = (type) => {
  switch (type) {
    case "temperatura":
      return faker.datatype.float({ min: 10, max: 40, precision: 0.1 });
    case "humedad":
      return faker.datatype.float({ min: 20, max: 90, precision: 0.1 });
    case "lluvia":
      return faker.datatype.boolean() ? 1 : 0;
    case "radiacion":
      return faker.datatype.float({ min: 100, max: 2000, precision: 0.1 });
    default:
      return null;
  }
};
