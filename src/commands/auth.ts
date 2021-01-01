import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import fiiCommand from "../classes/Command";
import Enmap from "enmap";
import { argon2i } from "argon2-ffi"
module.exports = class Auth extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'auth',
            description: 'S\'authetifier avec son nom d\'utilisateur et son ID FII'
        })
    }
    async run(message: mokaMessage, args: string[]) {
        if(!args[0] || !args[1]) {
            message.channel.send('Veuillez indiquer un nom d\'utilisateur et un ID!');
            return;
        }
        if(message.channel.type != "dm") {
            message.channel.send('Cette commande ne peut que être exécutée en message privés!')
            return;
        }
        const idb = new Enmap({
            name: "ids",
            dataDir: `${__dirname}/../../ids/`,
          });
      
        await idb.defer;
        if(!idb.has(args[0])) {
            message.channel.send('', {
                embed: {
                    description: `L'utilisateur ${args[0]} n'existe pas!`,
                    color: 'RED'
                }
            })
        }
        const hashedID = idb.get(args[0]);
        const res = await argon2i.verify(hashedID, args[1]).catch(e => {});
        if(!res) {
            message.channel.send('', {
                embed: {
                    description: `ID incorrect!`,
                    color: 'RED'
                }
            })
        } 
        if(res == true) {
            message.channel.send('', {
                embed: {
                    description: 'Authentification réussie!\nLe C.A de la FII a reçu cette information, vous êtes maintenant validé!',
                    color: 'GREEN'
                }
            })
        }
    }
}