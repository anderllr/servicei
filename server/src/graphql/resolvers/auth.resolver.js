export const authenticated = resolver => (parent, args, context, info) => {
    //TODO Put a new token verification
    if (context.authUser) {
        return resolver(parent, args, context, info);
    }
    throw new Error("User is not authenticated");
};

export const masterUserId = authUser =>
    authUser.masterUserId !== "same" ? authUser.masterUserId : authUser.id;
