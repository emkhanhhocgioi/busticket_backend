const WebSocket = require('ws');
const clients = new Map();
const {createNotification} = require('../controller/notification_controller');
const onConnection = (ws, req) => {
    ws.on('message', async (data) => {
        const message = JSON.parse(data);

        if (message.type === 'init') {
            const id = message.id;
            clients.set(id, ws);
            console.log(`New connection from: ${id}`);
            return;
        }

       
        if (message.type === 'notification') {
            const {userId, fromId, content} = message.data;
            console.log(`Received notification from ${fromId} to ${userId}: ${content}`);


        

            // Create notification in the database
           const res = await createNotification(userId, fromId, content);
           console.log('Notification created:', res);
            // Send notification to the user
            if (res && clients.has(fromId)) {
                clients.get(fromId).send(JSON.stringify({
                    type: 'notification',
                    from: userId,
                    message: content
                }));
            }
        }

        if(message.type === 'accept_order') {
             const {userId, fromId, content} = message.data;
            console.log(`Received notification from ${fromId} to ${userId}: ${content}`);
            
            // Create notification in the database
           const res = await createNotification(userId, fromId, content);
           console.log('Notification created:', res);
            // Send notification to the user
            if (res && clients.has(fromId)) {
                clients.get(fromId).send(JSON.stringify({
                    type: 'notification',
                    from: userId,
                    message: content
                }));
            }
        }

        
                    
    });

    ws.on('close', () => {
        for (const [userId, socket] of clients.entries()) {
            if (socket === ws) {
                clients.delete(userId);
                break;
            }
        }
    });

    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket Server',
        online: clients.size
    }));
};



module.exports = { onConnection,};