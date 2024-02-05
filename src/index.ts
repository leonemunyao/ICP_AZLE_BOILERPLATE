// cannister code goes here
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';


/**
 * This type represents a message that can be listed on a board
 */

type Message = Record<{
    id: string;
    title: string;
    body: string;
    attachmentURL: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>

// Defining the message payload type.
/**
 * We need to specify what kind of data will sent to our smart contract. This is called the  payload.
 */

type MessagePayload = Record<{
    title: string;
    body: string;
    attachmentURL: string;
}>


// Defining message storage
/**
 * This a storage variable.This line of code establishes a storage variable called messageStorage which is a map associated strings(keys)
 * with messages(values)
 */

const messageStorage = new StableBTreeMap<string, Message>(0, 44, 1024);