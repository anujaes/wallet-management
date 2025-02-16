// utils/responseHandler.ts

import { error } from "console";

interface ResponseData<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

/**
 * @param message String - Message to be sent in response
 * @param data any - Data to be sent in response
 * @returns any - Returns response object
 */
const successResponse = <T>(message: string, data?: T) => {
    return {
        success: true,
        message,
        data,
    } as ResponseData<T>;
};

/**
 * @param message String - Message to be sent in response
 * @param error any - Error object
 * @returns any - Returns response object
 */
const errorResponse = (message: string, error?: any) => {
    return {
        success: false,
        message: message || error.message || "Something went wrong!",
        error,
    } as ResponseData<null>;
};


const responseHandler = (result: any) => {
    return {
        succes: result.success,
        message: result.message,
        error: result.error,
        data: result.data
    } as any;
}

export { successResponse, errorResponse, responseHandler };
