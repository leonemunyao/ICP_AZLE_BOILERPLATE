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

// De