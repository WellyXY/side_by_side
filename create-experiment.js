alert("✅ Firebase Version Loaded! If you see this, the cache is clear. The app will now work correctly.");

import { db, collection, addDoc } from './firebase-config.js';

class CreateExperimentManager {
    constructor() {
        this.videoFilesA = [];
        this.videoFilesB = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('createBtn').addEventListener('click', () => this.createExperiment());
        document.getElementById('folderA').addEventListener('change', (e) => this.handleFolderSelect(e, 'A'));
        document.getElementById('folderB').addEventListener('change', (e) => this.handleFolderSelect(e, 'B'));
    }

    handleFolderSelect(event, folderId) {
        const files = Array.from(event.target.files).filter(file => file.type.startsWith('video/'));
        if (folderId === 'A') {
            this.videoFilesA = files;
        } else {
            this.videoFilesB = files;
        }
        this.updateFolderInfo(folderId, files);
        this.calculateMatching();
    }

    updateFolderInfo(folderId, files) {
        const infoEl = document.getElementById(`folder${folderId}Info`);
        infoEl.textContent = `${files.length} video(s) selected.`;
        infoEl.style.display = 'block';
    }

    calculateMatching() {
        const pairs = this.matchVideoPairs(this.videoFilesA, this.videoFilesB);
        const previewEl = document.getElementById('matchingPreview');
        if (pairs.length > 0) {
            previewEl.innerHTML = `Found <strong>${pairs.length}</strong> matching video pairs.<br><small>Example: ${pairs[0].a.name} &harr; ${pairs[0].b.name}</small>`;
            previewEl.style.display = 'block';
        } else {
            previewEl.style.display = 'none';
        }
    }
    
    matchVideoPairs(filesA, filesB) {
        const pairs = [];
        filesA.forEach(fileA => {
            const matchingFileB = filesB.find(fileB => this.getCleanName(fileA.name) === this.getCleanName(fileB.name));
            if (matchingFileB) {
                pairs.push({
                    a: { name: fileA.name, path: URL.createObjectURL(fileA) },
                    b: { name: matchingFileB.name, path: URL.createObjectURL(matchingFileB) }
                });
            }
        });
        return pairs;
    }
    
    getCleanName(filename) {
        return filename.replace(/\.[^/.]+$/, "").toLowerCase();
    }

    async createExperiment() {
        const name = document.getElementById('experimentName').value.trim();
        const description = document.getElementById('experimentDescription').value.trim();
        
        // We get folder names from the input fields, not the file list
        const folderAName = document.getElementById('folderA').value.split('\\').pop().split('/').pop();
        const folderBName = document.getElementById('folderB').value.split('\\').pop().split('/').pop();

        if (!name || this.videoFilesA.length === 0 || this.videoFilesB.length === 0) {
            this.showMessage('Experiment Name and video folders are required.', 'error');
            return;
        }

        const pairs = this.matchVideoPairs(this.videoFilesA, this.videoFilesB);
        if (pairs.length === 0) {
            this.showMessage('No matching video pairs found. Cannot create experiment.', 'error');
            return;
        }
        
        // Note: For a web-based tool, storing full paths isn't feasible.
        // We will store the names and assume the user can provide the videos again if needed,
        // or we would need a proper upload-to-cloud-storage mechanism.
        // For now, we only store the *names* of the files.
        const storablePairs = pairs.map(p => ({
            a: p.a.name,
            b: p.b.name
        }));

        const newExperiment = {
            name,
            description,
            folderA: folderAName,
            folderB: folderBName,
            pairs: storablePairs,
            userSessions: {},
            createdAt: new Date().toISOString()
        };

        this.showLoading('Creating experiment in Firebase...');
        try {
            const docRef = await addDoc(collection(db, "experiments"), newExperiment);
            this.showMessage(`✅ Experiment created successfully with ID: ${docRef.id}`, 'success');
            setTimeout(() => {
                window.location.href = `experiment-manager.html?cacheBust=${new Date().getTime()}`;
            }, 1500);
        } catch (e) {
            console.error("Error adding document: ", e);
            this.showMessage(`Failed to create experiment in Firebase: ${e.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('messageArea');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
    }

    showLoading(text) {
        const createBtn = document.getElementById('createBtn');
        createBtn.disabled = true;
        createBtn.innerHTML = `<span class="spinner"></span> ${text}`;
    }

    hideLoading() {
        const createBtn = document.getElementById('createBtn');
        createBtn.disabled = false;
        createBtn.innerHTML = 'Create Experiment';
    }
}

// Ensure the DOM is loaded before creating the manager
document.addEventListener('DOMContentLoaded', () => {
    new CreateExperimentManager();
}); 