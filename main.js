const contextMenu = document.querySelector('#context-menu');

const issuesStorage = class {
	constructor() {
		this.__storageKey = 'rctagger';
		this.table = document.querySelector('table.issues');
		this.issues =  this.__get() || {};
	}

	refresh() {
		this.table.querySelectorAll('tr').forEach(function(tr) {
			tr.style.background = '';
		});

		for (var id in this.issues) {
			if (!this.table.querySelector('#' + id)) {
				this.delete(id);
				continue;
			}

			this.table.querySelector('#' + id).style.background = this.issues[id];
		}
	}

	__get() {
		return JSON.parse(localStorage.getItem(`${this.__storageKey}.issues`));
	}

	__set(issues) {
		localStorage.setItem(`${this.__storageKey}.issues`, JSON.stringify(issues));
	}

	add(issueId, color) {
		this.issues[issueId] = color;
		color ? this.__set(this.issues) : this.delete(issueId);
		return this;
	}

	delete(issueId) {
		delete this.issues[issueId];
		this.__set(this.issues);
		return this;
	}
}

const issuesStorageList = new issuesStorage();
issuesStorageList.refresh();

function createColorItem(child) {
	const item = document.createElement('li');
	item.appendChild(child);
	return item;
};

const colorList = document.createElement('ul');
const colors = [
	{
		code: '',
		text: 'Сбросить',
	},
	{
		code: '#ff6080',
		text: 'Красный',
	},
	{
		code: 'lightyellow',
		text: 'Желтый',
	},
	{
		code: '#aaf0d1',
		text: 'Зеленый',
	},
	{
		code: '#b284be',
		text: 'Фиолетовый',
	},
	{
		code: '#7cb9e8',
		text: 'Синий',
	},
	{
		code: '#9ab3cc',
		text: '',
	},
	{
		code: '#d7eff7',
		text: '',
	},
	{
		code: '#F5D0FE',
		text: 'Fuchsia 200',
	},
];

colors.forEach(function(color) {
	let colorEl = document.createElement('a');
	colorEl.href = 'javascript:;';
	colorEl.style.background = color.code;
	colorEl.text = color.text;
	colorEl.addEventListener('click', function() {
		issuesStorageList.add(focusedIssueId, color.code).refresh();
		document.body.click();
	});

	colorList.appendChild(createColorItem(colorEl));
});

const rcTaggerMenuItem = document.createElement('li');
rcTaggerMenuItem.classList.add('rctagger', 'folder');

const dropdowner = document.createElement('a');
dropdowner.href = 'javascript:;';
dropdowner.text = 'Выбрать цвет';
rcTaggerMenuItem.appendChild(dropdowner);
rcTaggerMenuItem.appendChild(colorList);

//===

new MutationObserver(function(mutations) {

	if (mutations[mutations.length - 1].addedNodes.length > 0) {
		let ul = contextMenu.querySelector('ul');

		if (ul && !contextMenu.querySelector('.rctagger')) {
			ul.appendChild(rcTaggerMenuItem);
		}
	}

	console.log('change context menu after focus ' + focusedIssueId);

}).observe(contextMenu, {
	childList: true
});

//==

let focusedIssueId = '';

function contextMenuOpen(e) {
	const tr = e.target.closest('.hascontextmenu');
	if (!tr) return;

	focusedIssueId = e.target.closest('.hascontextmenu').id;
	console.log('Focus issue', focusedIssueId);
}

document.addEventListener('contextmenu', contextMenuOpen);
document.addEventListener('click', contextMenuOpen);
