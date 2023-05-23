import {getSession} from "next-auth/react";
import {router} from "next/client";

export async function getToken() {
    const session = await getSession();
    const jwtToken = session?.jwtToken.email;
    if (jwtToken === undefined) {
        router.replace("/login");
        return;
    }
    const token = {'Authorization': `Bearer ${jwtToken}`}
    return token;
}