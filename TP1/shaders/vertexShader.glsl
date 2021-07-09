
        // atributos del vértice

        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

        // variables Uniform (son globales a todos los vértices y de solo-lectura)

        uniform mat4 uMMatrix;     // matriz de modelado
        uniform mat4 uVMatrix;     // matriz de vista
        uniform mat4 uPMatrix;     // matriz de proyección
        uniform mat3 uNMatrix;     // matriz de normales


        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        // constantes

        const float PI=3.141592653;

        void main(void) {

            vec3 position = aPosition;
            vec3 normal = aNormal;
            vec2 uv = aUv;


            vec4 worldPos = uMMatrix*vec4(position, 1.0);

            gl_Position = uPMatrix*uVMatrix*worldPos;

            vWorldPosition=worldPos.xyz;
            vNormal=normalize(uNMatrix * aNormal);
            vUv=uv;
        }
