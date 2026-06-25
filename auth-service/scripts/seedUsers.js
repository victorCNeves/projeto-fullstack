import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import connectDB from '../src/config/db.js';

const SALT_ROUNDS = 10;

const users = [
  { username: 'user', password: 'user' },
  { username: 'ana_silva', password: 'userPass_9871' },
  { username: 'lucas_santos', password: 'secureKey_4421' },
  { username: 'mari_oliveira', password: 'mySecret_8832' },
  { username: 'pedro_almeida', password: 'passWord_1109' },
  { username: 'carla_costa', password: 'safeWord_7765' },
  { username: 'thiago_lima', password: 'p@ssword_2026' },
  { username: 'julia_ribeiro', password: 'crypto_9912' },
  { username: 'bruno_carvalho', password: 'lockCode_3345' },
  { username: 'fernanda_gomes', password: 'hidden_7712' },
  { username: 'rafael_martins', password: 'access_5543' },
  { username: 'gabriela_souza', password: 'token_8891' },
  { username: 'felipe_rodrigues', password: 'entry_1122' },
  { username: 'beatriz_alves', password: 'shield_4432' },
  { username: 'gustavo_pereira', password: 'guard_9900' },
  { username: 'larissa_mendes', password: 'vault_7766' },
  { username: 'diego_barros', password: 'matrix_1010' },
  { username: 'camila_nunes', password: 'cipher_5544' },
  { username: 'leonardo_pinto', password: 'secure_3322' },
  { username: 'isabela_freitas', password: 'protect_8877' },
  { username: 'mateus_lopes', password: 'keychain_4455' },
];

const hashUserPasswords = (userList) => {
  return userList.map((user) => ({
    username: user.username,
    password: bcrypt.hashSync(user.password, SALT_ROUNDS),
  }));
};

const run = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('[auth-service] Erro ao conectar no banco:', error);
    process.exit(1);
  }

  try {
    const usersHash = hashUserPasswords(users);
    console.log('[auth-service] Terminei criptografia das senhas');

    await User.insertMany(usersHash, { ordered: false });
    console.log('[auth-service] Terminei usuários');

    console.log('[auth-service] Seed concluído');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[auth-service] Erro ao salvar usuários:', error);

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

await run();
