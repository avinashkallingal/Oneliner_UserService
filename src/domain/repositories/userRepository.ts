import { IUser } from "../entities/IUser";
import bcrypt from 'bcrypt';
import { IUserDocument, User } from '../../model/userModel'
import mongoose from "mongoose";
import { devNull } from "os";
import { IUserDetails, IUserPostDetails } from "../../domain/entities/IUserDeatils";


export class UserRepository {

    async findEmail(id: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ _id: id });
            
            return user
        } catch (error) {
            const err = error as Error;
            console.log('error in findEmail in userRepository-->', err);
            return null
        }
    }

    async findEmailForForgotPass(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email: email });
            
            return user
        } catch (error) {
            const err = error as Error;
            console.log('error in findEmail in userRepository-->', err);
            return null
        }
    }
   

    async saveUser(data: IUser): Promise<IUser> {
        try {
            console.log(data, '--------------------------------------userRepo');

            // Hash the password
            console.log(data.password);
            const hashedPass = await bcrypt.hash(data.password, 10);

            // Create a new user object with the hashed password
            const userData = { ...data, password: hashedPass };

            console.log(userData, '----------userData');

            // Create a new instance of the User model
            const newUser = new User(userData);

            // Save the user to the database
            await newUser.save();

            console.log(newUser, '-------------------------------------------');

            // Return the saved user data (you might want to omit the password)
            return newUser
            
        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
            
        }
    }

    async checkUser(email: string, password: string): Promise<{ success: boolean, message: string, user_data?: IUser }> {
        try {
            const user_data = await User.findOne({ email }).exec();

            if (!user_data) {
                return { success: false, message: "Incorrect Email Address or Password" };
            }

            const passwordMatch = await bcrypt.compare(password, user_data.password);
            if (!passwordMatch) {
                return { success: false, message: "Incorrect Email Address or Password" };
            }

            if (user_data.isBlocked) {
                return { success: false, message: "You have been blocked by the admin", user_data };
            }
            return { success: true, message: "Logged in successful", user_data };


        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
        }
    }

    async resetPassword(email: string, password: string) {
        try {
            const newHashedPass = await bcrypt.hash(password, 10);
            let user_data = await User.findOne({ email }).exec();
            if (user_data) {
                console.log('if in repo')
                const res = await User.updateOne({ email: email }, { $set: { password: newHashedPass } });
                console.log(res);
                return { success: true, message: 'Password changed successfully' }
            } else {
                console.log('else in repo')
                return { success: false, message: 'Something went wrong, Plase try again later.' }
            }

        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
        }
    }

    async savePost(postId: string, userId: string) {
        try {
           
            let user_data = await User.findOne({ _id:userId }).exec();
            if (user_data) {
                console.log(postId+'if in repo$$$$$$$$$$$')
                // const res = await User.updateOne({ _id: userId }, { $set: { savePost: newHashedPass } });
                const res = await User.updateOne(
                    { _id: userId },
                    { $push: { savedPost: postId } }
                  );
                console.log(res);
                return { success: true, message: 'post saved' }
            } else {
                console.log('else in repo')
                return { success: false, message: 'Something went wrong, Plase try again later.' }
            }

        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
        }
    }

    async followUser(data:{userId:string,followId:string}) {
        try {
           
            const res = await User.updateOne({ _id: data.userId }, { $push: { followings: data.followId } });
            const res1 = await User.updateOne({ _id: data.followId }, { $push: { followers: data.userId } });
            if ((res.modifiedCount > 0) && (res1.modifiedCount > 0)) {
                return { success: true, message: 'follow done' }
            } 
            // if (res1.modifiedCount > 0) {
            //     return { success: true, message: 'follow done' }
            // }
          
                console.log(res,res1,'  default return flase in follow function')
                return { success: false, message: 'Something went wrong, Plase try again later.' }          
                
           

        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
        }
    }


    async unFollowUser(data:{userId:string,followId:string}) {
        try {
           
            const res = await User.updateOne({ _id: data.userId }, { $pull: { followings: data.followId } });
            const res1 = await User.updateOne({ _id: data.followId }, { $pull: { followers: data.userId } });
            if (res.modifiedCount > 0) {
                return { success: true, message: 'unfollow done' }
            } 
            if (res1.modifiedCount > 0) {
                return { success: true, message: 'unfollow done' }
            }
          
                console.log(res,res1,'  default return flase in unfollow function')
                return { success: false, message: 'Something went wrong, Plase try again later.' }          
                
           

        } catch (error) {
            const err = error as Error;
            console.error("Error saving user:", err);
            throw new Error(`Error saving user: ${err.message}`);
        }
    }

    async updateUserProfile(data: any): Promise<IUser | null> {
        try {
            const currentUser = await User.findById(data.id);
            console.log('Current User:', currentUser);
            console.log('New Data:', data.data);
            interface updateUser{
                username?:string;
                profilePicture?:string;
                gender?:string;
                language?:string;
                about?:string
            }

            //avoinding null updation and validation
            const updateFields:updateUser = {};
            if (data.data.username !== undefined && data.data.username.length !== 0) {
              updateFields.username = data.data.username;
            }
            if (data.data.gender !== undefined && data.data.gender !== 0) {
              updateFields.gender = data.data.gender;
            }
            if (data.image !== undefined || data.image !== null || data.image !== '') {
              updateFields.profilePicture = data.image;
            }
            if (data.data.language !== undefined || data.data.language !== null) {
                updateFields.language = data.data.language;
              }
              if (data.data.about !== undefined || data.data.about !== null) {
                updateFields.about = data.data.about;
              }
            console.log(updateFields,"updated fields from react body")
    
            // Update the user in the database
           
            //

            const userExist = await User.updateOne(
                { _id: data.id },
                { $set: updateFields }
            );

            console.log(userExist, '-------------============== 50');

            if (userExist.modifiedCount > 0) {
                const updatedUser = await User.findById(data.id);
                return updatedUser;
            } else {
                console.log('No changes were made to the document.');
                return null;
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            return null;
        }
    }
    async findUserDetailsForPost(userId: string): Promise<{ success: boolean; message: string; data?: IUserPostDetails }> {
        try {
            console.log('3', userId);
            const user = await User.findById(userId).exec() as IUser | null;
            console.log(user, '----------------------user data');
            if (!user) {
                return { success: false, message: "No user found" };
            }

            const datas: IUserPostDetails = {
                id: userId,
                name: user.username
            };

            return { success: true, message: "Data found", data: datas };
        } catch (error) {
            console.error("Error fetching user data", error);
            return { success: false, message: `Error fetching user data: ${(error as Error).message}` };
        }
    }

    async searchUser(
        query: string
      ): Promise<{ success: boolean; message: string; data?: any }> {
        try {
          console.log("Search Query:", query);
      
          // Use regex to find users with a partial match in relevant fields
        //   const users = await User.find({
        //     $or: [
        //       { username: { $regex: query, $options: "i" } }, // Match in username field
        //       { email: { $regex: query, $options: "i" } }, // Match in email field
        //     ],
        //   }).exec();

        const users = await User.find({
            username: { $regex: query, $options: "i" } // Case-insensitive match in username field only
          }).exec();
          
      
          console.log(users, "----------------------Matched Users");
      
          if (!users || users.length === 0) {
            return { success: false, message: "No users found" };
          }
      
          return { success: true, message: "Users found", data: users };
        } catch (error) {
          console.error("Error fetching user data", error);
          return { success: false, message: `Error fetching user data: ${(error as Error).message}` };
        }
      }


}

//---------------------------------------------------------------------------------------------------------------------------------