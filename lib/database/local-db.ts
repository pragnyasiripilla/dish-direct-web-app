import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DB_PATH, "users.json")
const RESTAURANTS_FILE = path.join(DB_PATH, "restaurants.json")
const DONATIONS_FILE = path.join(DB_PATH, "donations.json")

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

// Initialize files if they don't exist
const initFile = (filePath: string, defaultData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
  }
}

initFile(USERS_FILE, [])
initFile(RESTAURANTS_FILE, [])
initFile(DONATIONS_FILE, [])

export class LocalDB {
  static readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
  }

  static writeUsers(users: any[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  }

  static addUser(user: any) {
    const users = this.readUsers()
    users.push({ ...user, id: Date.now().toString(), createdAt: new Date().toISOString() })
    this.writeUsers(users)
    return users[users.length - 1]
  }

  static findUserByEmail(email: string) {
    const users = this.readUsers()
    return users.find((user: any) => user.email === email)
  }

  static readDonations() {
    return JSON.parse(fs.readFileSync(DONATIONS_FILE, "utf8"))
  }

  static writeDonations(donations: any[]) {
    fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2))
  }

  static addDonation(donation: any) {
    const donations = this.readDonations()
    donations.push({ ...donation, id: Date.now().toString(), createdAt: new Date().toISOString() })
    this.writeDonations(donations)
    return donations[donations.length - 1]
  }
}
