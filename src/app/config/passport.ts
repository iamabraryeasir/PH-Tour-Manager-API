import passport from 'passport';
import bcrypt from 'bcryptjs';
import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback,
} from 'passport-google-oauth20';
import config from '.';
import { User } from '../modules/user/user.model';
import { Role } from '../modules/user/user.interface';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email: string, password: string, done) => {
            try {
                // check if is user already registered
                const isUserExist = await User.findOne({ email });
                if (!isUserExist) {
                    return done("User doesn't exist");
                }
                const isGoogleAuthenticated = isUserExist.auths.some(
                    (providerObjects) => providerObjects.provider === 'google'
                );
                if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, {
                        message:
                            "You have authenticated through Google. So if you wan't to login with credentials. then at first login with google and set a password in your gmail and then you can login with email and password",
                    });
                }

                // match the password
                const isPasswordMatched = await bcrypt.compare(
                    password,
                    isUserExist?.password as string
                );
                if (!isPasswordMatched) {
                    return done(null, false, {
                        message: "Password doesn't match",
                    });
                }

                return done(null, isUserExist);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientId,
            clientSecret: config.googleClientSecret,
            callbackURL: config.googleCallbackUrl,
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const email = profile?.emails?.[0]?.value;
                if (!email) {
                    return done(null, false, { message: 'No email found' });
                }

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: 'google',
                                providerId: profile.id,
                            },
                        ],
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
