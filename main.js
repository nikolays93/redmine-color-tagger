const contextMenu = document.querySelector('#context-menu');

const issuesStorage = class {
	constructor() {
		this.__storageKey = 'rctagger';
		this.table = document.querySelector('table.issues');
		this.issues =  this.__get() || {};
	}

	__get() {
		return JSON.parse(localStorage.getItem(`${this.__storageKey}.issues`));
	}

	__set(issues) {
		localStorage.setItem(`${this.__storageKey}.issues`, JSON.stringify(issues));
		return this;
	}

	refresh() {
		this.table.querySelectorAll('tr').forEach((tr) => {
			if (!tr.id) return;

			if (!this.issues.hasOwnProperty(tr.id)) {
				this.add(tr.id);
				tr.classList.add('newbie');
			} else {
				tr.style.background = this.issues[tr.id];
			}
		});
	}

	clear() {
		for (var id in this.issues) {
			if (!this.table.querySelector('#' + id)) {
				this.delete(id);
			}
		}
	}

	add(issueId, color) {
		this.issues[issueId] = color || '';
		return this.__set(this.issues);
	}

	delete(issueId) {
		delete this.issues[issueId];
		return this.__set(this.issues);
	}
}

const issuesStorageList = new issuesStorage();
issuesStorageList.refresh();
issuesStorageList.clear();

function createColorItem(color) {
	let colorEl = document.createElement('a');
	colorEl.href = 'javascript:;';
	colorEl.style.background = color.code;
	colorEl.title = color.name || '';
	colorEl.text = color.text || '';

	colorEl.addEventListener('click', function() {
		issuesStorageList.add(focusedIssueId, color.code).refresh();
		document.body.click();
	});

	const item = document.createElement('li');
	item.appendChild(colorEl);
	return item;
};

const colorList = document.createElement('ul');
const colors = [
	{
		code: '#FF6080',
		name: 'Красный',
	},
	{
		code: '#FFFFE0',
		name: 'Желтый',
	},
	{
		code: '#B284BE',
		name: 'Фиолетовый',
	},
	{
		code: '#7CB9E8',
		name: 'Синий',
	},
	{
		code: '#9AB3CC',
		name: '',
	},
	{
		code: '#D7EFF7',
		name: '',
	},
	{
		code: '#F5D0FE',
		name: 'Фуксия',
	},
];

colorList.appendChild(createColorItem({code: '', text: 'Сбросить'}));
colors.forEach(function(color) {
	colorList.appendChild(createColorItem(color));
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
