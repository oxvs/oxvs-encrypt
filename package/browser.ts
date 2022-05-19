/**
 * @file Handle browser functionality
 * @name browser.ts
 * @author 0aoq <hkau@oxvs.net>
 * @license Apache-2.0
 */

import { core } from "./core"

const _window = window as any

/**
 * @class BrowserHandler
 * @description Handle the creation of sets through UI
 */
export class OXVSBrowserHandler {
    cancel: boolean

    constructor() {
        this.cancel = false
    }

    /**
     * @function addCharacter
     * @description Create a set from the UI
     */
    public addCharacter(character: string) {
        let set = _window.prompt(`Provide a value for the character "${character}" below. Leave blank to use "${character}" as the value.\n\nEnter "DONE" to cancel.`)
        if (set && set !== 'DONE') {
            core.getTo(character).then(() => {
                // already exists
                const doReplace = confirm(`The character "${character}" is already in the set. Replace it?`)
                if (doReplace) {
                    if (set === '') set = character
                    core.getTo(character).then((_letter: any) => core.currentSet[core.currentSet.indexOf(_letter)] = [character, set])
                }
            }).catch(() => {
                // doesn't exist
                if (set === '') set = character
                core.currentSet.push([character, set])
            })
        } else if (set === 'DONE') {
            alert(`Cancelled.`)
            this.cancel = true
        }
    }

    /**
     * @function createSet
     * @description Create a set from the UI
     * 
     * @returns {any} The set
     */
    public createSet() {
        core.currentSet = [["​", "schar"]]
        const base = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '"', '\'', '<', '>', '?', '.', ',', '`', '~', ' ']

        let setSeperationCharacter = prompt("Enter a set seperation character. Leave blank for zero-width-space.")
        if (setSeperationCharacter === '') setSeperationCharacter = '\u200b'
        core.currentSet[0][0] = setSeperationCharacter as any

        const doCreate = confirm(`Create a new set?`)
        if (doCreate) {
            let set = _window.prompt(`Provide a set of characters below (a, b, A, B). Leave blank to use: \n\n"${base.join(', ')}"`)
            if (set) {
                const setArray = set.split(', ')

                for (let character of setArray) {
                    if (this.cancel) break
                    this.addCharacter(character)
                }

                this.cancel = false
                return core.currentSet
            } else {
                set = base
                alert("Using default set. \n\nPlease create your character replacements.")

                for (let character of set) {
                    if (this.cancel) break
                    this.addCharacter(character)
                }

                this.cancel = false
                return core.currentSet
            }
        }
    }
}

/**
 * @global window.OXVSCipher
 * @description The OXVSCipher object
 */
_window.OXVSCipher = {
    ...core,
    OXVSBrowserHandler
}