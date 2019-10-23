export const isValidEmail = email => {
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
};

export const isValidCpfCnpj = cpfCnpjIn => {
    let cpfCnpj = cpfCnpjIn.replace(/\D/g, "");

    if (cpfCnpj.length <= 11) {
        if (
            !cpfCnpj ||
            cpfCnpj.length != 11 ||
            cpfCnpj == "00000000000" ||
            cpfCnpj == "11111111111" ||
            cpfCnpj == "22222222222" ||
            cpfCnpj == "33333333333" ||
            cpfCnpj == "44444444444" ||
            cpfCnpj == "55555555555" ||
            cpfCnpj == "66666666666" ||
            cpfCnpj == "77777777777" ||
            cpfCnpj == "88888888888" ||
            cpfCnpj == "99999999999"
        )
            return false;
        var soma = 0;
        var resto;
        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(cpfCnpj.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpfCnpj.substring(9, 10))) return false;
        soma = 0;
        for (var i = 1; i <= 10; i++)
            soma = soma + parseInt(cpfCnpj.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpfCnpj.substring(10, 11))) return false;
        return true;
    } else {
        if (
            !cpfCnpj ||
            cpfCnpj.length != 14 ||
            cpfCnpj == "00000000000000" ||
            cpfCnpj == "11111111111111" ||
            cpfCnpj == "22222222222222" ||
            cpfCnpj == "33333333333333" ||
            cpfCnpj == "44444444444444" ||
            cpfCnpj == "55555555555555" ||
            cpfCnpj == "66666666666666" ||
            cpfCnpj == "77777777777777" ||
            cpfCnpj == "88888888888888" ||
            cpfCnpj == "99999999999999"
        )
            return false;
        var tamanho = cpfCnpj.length - 2;
        var numeros = cpfCnpj.substring(0, tamanho);
        var digitos = cpfCnpj.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;
        tamanho = tamanho + 1;
        numeros = cpfCnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) return false;
        return true;
    }
};

export const isValidCep = cep => cep.length === 9;
