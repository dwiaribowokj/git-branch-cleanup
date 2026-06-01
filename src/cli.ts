#!/usr/bin/env node
import { gitBranchesCommand } from './branches.js';
gitBranchesCommand().name('git-branch-cleanup').parse();
