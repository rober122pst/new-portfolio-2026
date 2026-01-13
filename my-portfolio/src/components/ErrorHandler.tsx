export default function ErrorHandler({ message }: { message: string }) {
    throw new Error(message);
}
