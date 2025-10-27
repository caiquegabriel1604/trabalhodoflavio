// ========== ELEMENTOS ==========
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const mainContainer = document.getElementById('main-container');
const logoutBtn = document.getElementById('logout-btn');

// ---------- Troca de telas ----------
document.getElementById('to-register').onclick = () => {
  loginContainer.classList.remove('active');
  registerContainer.classList.add('active');
};
document.getElementById('to-login').onclick = () => {
  registerContainer.classList.remove('active');
  loginContainer.classList.add('active');
};

// ---------- Tipos de login ----------
const loginAlunoBtn = document.getElementById('login-aluno-btn');
const loginProfBtn = document.getElementById('login-prof-btn');
loginAlunoBtn.onclick = () => toggleLogin('aluno');
loginProfBtn.onclick = () => toggleLogin('professor');

function toggleLogin(tipo) {
  document.querySelectorAll('.login-tipo button').forEach(b => b.classList.remove('ativo'));
  document.querySelectorAll('.login-form').forEach(f => f.classList.remove('ativo'));
  if (tipo === 'aluno') {
    loginAlunoBtn.classList.add('ativo');
    document.getElementById('login-aluno').classList.add('ativo');
  } else {
    loginProfBtn.classList.add('ativo');
    document.getElementById('login-professor').classList.add('ativo');
  }
}

// ---------- Tipos de cadastro ----------
const cadastroAlunoBtn = document.getElementById('cadastro-aluno-btn');
const cadastroProfBtn = document.getElementById('cadastro-prof-btn');
cadastroAlunoBtn.onclick = () => toggleCadastro('aluno');
cadastroProfBtn.onclick = () => toggleCadastro('professor');

function toggleCadastro(tipo) {
  document.querySelectorAll('.register-tipo button').forEach(b => b.classList.remove('ativo'));
  document.querySelectorAll('.register-form').forEach(f => f.classList.remove('ativo'));
  if (tipo === 'aluno') {
    cadastroAlunoBtn.classList.add('ativo');
    document.getElementById('cadastro-aluno').classList.add('ativo');
  } else {
    cadastroProfBtn.classList.add('ativo');
    document.getElementById('cadastro-professor').classList.add('ativo');
  }
}

// ---------- Cadastro ----------
document.getElementById('cadastrar-aluno').onclick = () => {
  const email = document.getElementById('aluno-email').value;
  if (!email.endsWith('@escola.pr.gov.br')) return alert('Use um email institucional.');
  const senha = document.getElementById('aluno-senha').value;
  const nome = document.getElementById('aluno-nome').value;
  const turma = document.getElementById('aluno-turma').value;
  salvarUsuario({ tipo: 'aluno', email, senha, nome, turma, ativo: true });
  alert('Aluno cadastrado com sucesso!');
};
document.getElementById('cadastrar-prof').onclick = () => {
  const email = document.getElementById('prof-email').value;
  if (!email.includes('@gmail.com')) return alert('Use um Gmail válido.');
  const senha = document.getElementById('prof-senha').value;
  const nome = document.getElementById('prof-nome').value;
  const disciplina = document.getElementById('prof-disciplina').value;
  salvarUsuario({ tipo: 'professor', email, senha, nome, disciplina, ativo: true });
  alert('Professor cadastrado com sucesso!');
};

function salvarUsuario(user) {
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (usuarios.find(u => u.email === user.email)) return alert('Usuário já existe!');
  usuarios.push(user);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// ---------- Login ----------
document.getElementById('login-btn-aluno').onclick = () => login('aluno');
document.getElementById('login-btn-prof').onclick = () => login('professor');

function login(tipo) {
  const email = tipo === 'aluno' 
    ? document.getElementById('login-email-aluno').value 
    : document.getElementById('login-email-prof').value;
  const senha = tipo === 'aluno' 
    ? document.getElementById('login-senha-aluno').value 
    : document.getElementById('login-senha-prof').value;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const user = usuarios.find(u => u.email === email && u.senha === senha && u.tipo === tipo);
  if (!user) return alert('Credenciais inválidas!');

  localStorage.setItem('usuarioLogado', JSON.stringify(user));
  loginContainer.classList.remove('active');
  mainContainer.classList.add('active');
  carregarPerfil();
  carregarAgendamentos();
}

// ---------- Logout ----------
logoutBtn.onclick = () => {
  localStorage.removeItem('usuarioLogado');
  mainContainer.classList.remove('active');
  loginContainer.classList.add('active');
};

// ---------- Navbar e seções ----------
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const navIndicator = document.querySelector('.nav-indicator');

navItems.forEach(item => {
  item.onclick = () => {
    document.querySelector('.nav-item.active')?.classList.remove('active');
    item.classList.add('active');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(item.dataset.section).classList.add('active');
    navIndicator.style.left = `${item.offsetLeft}px`;
    navIndicator.style.width = `${item.offsetWidth}px`;
  };
});

// ---------- Perfil ----------
function carregarPerfil() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  document.getElementById('perfil-nome').textContent = `👤 Nome: ${user.nome}`;
  document.getElementById('perfil-status').textContent = `🟢 Status: Ativo`;
  const preview = document.getElementById('foto-preview');
  const foto = localStorage.getItem(`foto_${user.email}`);
  if (foto) preview.src = foto;
}

// Upload foto
document.getElementById('foto-perfil').onchange = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const user = JSON.parse(localStorage.getItem('usuarioLogado'));
      localStorage.setItem(`foto_${user.email}`, evt.target.result);
      document.getElementById('foto-preview').src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// ---------- Agendamentos ----------
document.getElementById('form-agendamento').onsubmit = (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  const disciplina = document.getElementById('disciplina').value;
  const turma = document.getElementById('turma').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;

  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  agendamentos.push({ email: user.email, disciplina, turma, data, horario });
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

  alert('Agendamento realizado com sucesso!');
  e.target.reset();
  carregarAgendamentos();
};

function carregarAgendamentos() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  const lista = document.getElementById('lista-agendamentos');
  lista.innerHTML = '';
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  agendamentos.filter(a => a.email === user.email).forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.data} - ${a.horario} | ${a.turma} - ${a.disciplina}`;
    lista.appendChild(li);
  });
}
