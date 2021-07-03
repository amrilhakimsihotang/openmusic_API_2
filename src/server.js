require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

//OpenMusicService
const songs = require('./api/songs');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicValidator = require('./validator/openmusic');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const OpenPlaylistService = require('./services/postgres/OpenPlaylistService');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const OpenCollaborationService = require('./services/postgres/OpenCollaborationService');
const CollaborationsValidator = require('./validator/collaborations');


const init = async () => {
  const openMusicService = new OpenMusicService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const openCollaborationService = new OpenCollaborationService();
  const openPlaylistService = new OpenPlaylistService(openCollaborationService);


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    }
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    })
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: openMusicService,
        validator: OpenMusicValidator,
      }
    },
    {
      plugin: playlists,
      options: {
        service: openPlaylistService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        openCollaborationService,
        openPlaylistService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};


init();