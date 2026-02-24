import React, { useRef, useEffect } from 'react';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.15;

    vec3 col1 = vec3(0.96, 0.965, 0.97);
    vec3 col2 = vec3(0.92, 0.93, 0.95);
    vec3 col3 = vec3(0.42, 0.39, 1.0);

    float n = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 - t * 0.5) * 0.5 + 0.5;
    float n2 = cos(uv.x * 2.0 - t * 0.7) * sin(uv.y * 3.0 + t * 0.3) * 0.5 + 0.5;

    vec3 color = mix(col1, col2, n);
    color = mix(color, col3, n2 * 0.06);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderBackground() {
    const canvasRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexShader);
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(fs);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'u_time');
        const uRes = gl.getUniformLocation(program, 'u_resolution');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const render = (time) => {
            gl.uniform1f(uTime, time * 0.001);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animRef.current = requestAnimationFrame(render);
        };
        animRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
        />
    );
}
