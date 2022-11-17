// const Room = require('../schemas/room');

class ChatProvider {
    // 현재 존재하는 모든 룸 구하기
    publicRooms = async () => {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = chat;
        // const sids = wsServer.sockets.adapter.sids;
        // const rooms = wsServer.sockets.adapter.rooms;
        const publicRooms = [];
        rooms.forEach((_, key) => {
            if (sids.get(key) === undefined) {
                publicRooms.push(key);
            }
        });
        return publicRooms;
    };

    // 직접 소켓의 룸을 찾아야 할 때
    getRoomNum = async (socket) => {
        const allRooms = await socket.adapter.rooms.keys();

        console.log('allRooms에서 키값만 가져옴 ::: ', allRooms);

        let userRoom = '';
        for (let room of allRooms) {
            if (room.includes('gameRoom')) {
                userRoom = room;
            }
        }
        console.log('현재 유저의 룸 userRoom:::', userRoom);
        return userRoom;
    };
}

module.exports = new ChatProvider();
