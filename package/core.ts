/**
 * @file Handle core functionality
 * @name core.ts
 * @author 0aoq <hkau@oxvs.net>
 * @license Apache-2.0
 */

/**
 * @namespace core
 * @description Handle core functionality
 */
export namespace core {
    /**
     * @global currentSet
     * @decription The current set that the cipher will use
     */
    export let currentSet: [string, string][] = [["​", "schar"]]

    /**
     * @function updateSet
     * @description Update the current set
     * 
     * @param {[string, string][]} set The new set
     * @returns boolean Whether the set was updated
     */
    export function updateSet(set: [string, string][]): boolean {
        if (set.length === 0) return false
        currentSet = set
        return true
    }

    /**
     * @function getTo
     * @description Get the to value of a character
     * 
     * @param {string} from The original character 
     * @returns {Promise<string>} The specified character in the set to replace it with
     */
    export const getTo = (from: string) => {
        return new Promise((resolve, reject) => {
            for (let _letter of currentSet) {
                if (_letter[0] === from) resolve(_letter)
            }

            reject(null)
        })
    }

    /**
     * @function getFrom
     * @description Get the from value of a character
     * 
     * @param {string} to The replaced character
     * @returns {Promise<string>} The specified character in the set it replaced
     */
    export const getFrom = (to: string) => {
        return new Promise((resolve, reject) => {
            for (let _letter of currentSet) {
                if (_letter[1] === to) resolve(_letter)
            }

            reject(null)
        })
    }

    const illegal = `<>![](){}';:/$.,=-+*&^%$#@~"'?|\n\r`
    const checkIllegal = function (string: string) { return illegal.includes(string) }

    /**
     * @class OXVSCipherHandler
     * @description Handle cipher functionality
     */
    export class OXVSCipherHandler {
        groupCharacter: string = "!"
        constructor() { }

        /**
         * @function encode
         * @description Encode a string
         * 
         * @param {string} str The string to encode
         * @returns {Promise<string>} The encoded string
         */
        public encode(str: string): Promise<string> {
            this.groupCharacter = currentSet[0][0] // the first item of the first item in the set should always be the group character

            return new Promise((resolve, reject) => {
                // get each character in the string
                let chars = str.split("")
                let encoded = ""

                // replace each character with the corresponding code
                for (let i = 0; i < chars.length; i++) {
                    getTo(chars[i]).then((letter: [string, string] | any) => {
                        // add (groupCharacter) + letter.to
                        encoded += `${this.groupCharacter}${letter[1]}`
                    }).catch(() => encoded += '?INVALID?')
                }

                // return the string after 1 second
                setTimeout(() => {
                    resolve(encoded)
                })
            })
        }

        /**
         * @function decode
         * @description Decode a string
         * 
         * @param {string} str The string to decode
         * @returns {Promise<string>} The decoded string
         */
        public decode(str: string): Promise<string> {
            return new Promise((resolve, reject) => {
                let groupCharacter = str[0] || "λ" // the first character should always be the group character
                // get each character in the string
                let chars = str.split(groupCharacter)
                let decoded = ""

                // replace each character with the corresponding code
                for (let i = 0; i < chars.length; i++) {
                    if (!checkIllegal(chars[i])) {
                        getFrom(chars[i]).then((letter: [string, string] | any) => {
                            decoded += letter[0]
                        }).catch(() => decoded += '?UNKNOWN?')
                    } else {
                        decoded += chars[i]
                    }
                }

                // return the string after 1 second
                setTimeout(() => {
                    resolve(decoded)
                })
            })
        }
    }
}