const routes = (handler) => [
    { method: 'POST',path: '/playlists',handler: handler.postOpenPlayListsHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'GET',path: '/playlists',handler: handler.getOpenPlayListsHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'DELETE',path: '/playlists/{playlistId}',handler: handler.deleteOpenPlayListsByIdHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'POST',path: '/playlists/{playlistId}/songs',handler: handler.postSongHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'GET',path: '/playlists/{playlistId}/songs',handler: handler.getSongsHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'DELETE',path: '/playlists/{playlistId}/songs',handler: handler.deleteSongByIdHandler,
      options: {
        auth: 'openmusicapp_jwt',
      },
    },
    { method: 'GET',path: '/users',handler: handler.getUsersByUsernameHandler,
    }
  ];
  
  module.exports = routes;