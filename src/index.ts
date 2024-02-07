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


// Creating the Get Messages Functions
/**
 * The next step is to create a function that retrieves all messages stored within our canister. 
 */

$query;
export function getMessages(): Result<Vec<Message>, string> {
    return Result.Ok(messageStorage.values());
}

// The getMessages() function gives access to all messages on our message board. The $query decorator preceding the function tells Azle
// tha getMessages is a function 

// Creating the Get Message Function
/**
 * The next step involves creating a function to retrieve a specific message using its unique identifier ID
 */

$query
export function getMessage(id: string): Result<Message, string> {
    return match(messageStorage.get(id), {
        Some: (message) => Result.Ok<Message, string>(message),
        None: () => Result.Err<Message, string>(`a message with id=${id} not found`)
    });
}

// Creating the Add Message Function
/**
 * We will create a function to add new messages
 */

$update
export function addMessage(payload: MessagePayload): Result<Message, string> {
    const message: Message = {id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload};
    messageStorage.insert(message.id, message);
    return Result.Ok(message);
}

/**
 * $Update annotation is utilize to signify to Azle that this function is an update function
 */

// Developing the Update Message function
/**
 * The next step is to create a function that allows us to update an existing message. 
 */

$update;
export function updateMessage(id: string, payload: MessagePayload): Result<Message, string>{
    return match(messageStorage.get(id), {
        Some: (message) => {
            const updatedMessage: Message = {...message, ...payload, updatedAt: Opt.Some(ic.time())};
            messageStorage.insert(message.id, updatedMessage);
            return Result.Ok<Message, string>(updatedMessage);
        },
        None: () =>  Result.Err<Message, string>(`couldn't update the message with id=${id}. message not found`)
    });
}

// Creating a function to delete a Message

$update;
export function deleteMessage(id: string): Result<Message, string> {
    return match(messageStorage.remove(id), {
        Some: (deletedMessage) => Result.Ok<Message, string>(deletedMessage),
        None: () => Result.Err<Message, string>(`couldn't delete the message with id=${id}. message not found`)
    })
}

/**
 * In the deletion code. We are using messageStorage.remove(id) method to remove a message by its ID from our storage. If the operaion
 * is successfull, it return deletd message
 */

// Configuring the UUID Package

globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32)

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256)
        }

        return array
    }
};

/**
 * In this  code we are extending globalThis object by adding a crypto property to it.
 */