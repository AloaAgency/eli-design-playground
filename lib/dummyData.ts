import { faker } from '@faker-js/faker'

export interface DataRow {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: 'Active' | 'Inactive' | 'Pending'
  salary: number
  startDate: string
  performance: number
  projects: number
  tasks: number
  teamSize: number
  location: string
}

export function generateDummyData(count: number): DataRow[] {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Design']
  const roles = ['Manager', 'Senior Developer', 'Developer', 'Designer', 'Analyst', 'Consultant', 'Director', 'VP', 'Associate', 'Lead']
  const statuses: DataRow['status'][] = ['Active', 'Inactive', 'Pending']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    status: faker.helpers.arrayElement(statuses),
    salary: faker.number.int({ min: 40000, max: 200000 }),
    startDate: faker.date.past({ years: 5 }).toLocaleDateString(),
    performance: faker.number.int({ min: 20, max: 100 }),
    projects: faker.number.int({ min: 0, max: 20 }),
    tasks: faker.number.int({ min: 0, max: 500 }),
    teamSize: faker.number.int({ min: 1, max: 50 }),
    location: faker.location.city() + ', ' + faker.location.countryCode(),
  }))
}