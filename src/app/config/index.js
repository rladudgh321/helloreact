"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backUrl = void 0;
exports.backUrl = process.env.NODE_ENV === 'production'
    ? 'http://localhost:3065'
    : 'http://127.0.0.1:3000';
