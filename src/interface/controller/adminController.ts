import { AdminService } from "../../application/use-case/admin"

interface userData {
    email: string,
    isBlocked: boolean
}
interface user {
    email: string,
    password: string
}
class adminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    async login(data: user) {
        try {
            // const email = data.email;
            // const password = data.password;
            console.log(data);
            const result = await this.adminService.adminLogin(data);
            return result;
        } catch (error) {

        }
    }

    async userList() {
        try {
            const result = await this.adminService.userList();
            return result;
        } catch (error) {

        }
    }

    async changeStatus(data: userData) {
        try {
            const email = data.email;
            const isBlocked = data.isBlocked
            const result = await this.adminService.changeStatus(email, isBlocked);
            return result;
        } catch (error) {

        }
    }
}

export const AdminController = new adminController();